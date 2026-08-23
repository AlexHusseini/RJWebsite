import React, { useState, useEffect } from 'react';
import { logout } from '../auth/authUtils';
import {
  getPhotos,
  addPhoto,
  deletePhoto as deletePhotoFromDb,
  getSections,
  addSection,
  deleteSection,
  updatePhotoSection,
  updatePhoto,
  getSettings,
  updateHomepagePhotos,
  updateProfilePhoto,
  gallerySectionsOnly,
  isUnassignedSection,
  UNASSIGNED_SECTION,
} from '../firebase/db';
import { deletePhoto } from '../firebase/storage';
import PhotoUpload from './PhotoUpload';
import { isUsableImageUrl } from '../utils/imageUrls';

const photoThumb = (photo) => photo.thumbnailUrl || photo.url;
const photoFull = (photo) => photo.fullUrl || photo.url;

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    section: '',
    alt: '',
    url: '',
  });
  const [newSection, setNewSection] = useState({ id: '', label: '' });
  const [showSuccess, setShowSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHomepagePhotos, setSelectedHomepagePhotos] = useState([null, null, null]);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [pickingFor, setPickingFor] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: '', description: '', section: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const flash = (message, isError = false) => {
    if (isError) {
      setError(message);
      setShowSuccess('');
    } else {
      setShowSuccess(message);
      setError(null);
    }
    setTimeout(() => {
      setShowSuccess('');
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPhotos, loadedSections, loadedSettings] = await Promise.all([
          getPhotos(),
          getSections(),
          getSettings(),
        ]);

        setPhotos(loadedPhotos);
        setSections(gallerySectionsOnly(loadedSections));

        if (loadedSettings) {
          if (loadedSettings.homepagePhotos) {
            setSelectedHomepagePhotos(
              loadedSettings.homepagePhotos.map((url) => (isUsableImageUrl(url) ? url : null))
            );
          }
          if (isUsableImageUrl(loadedSettings.profilePhoto)) {
            setSelectedProfilePhoto(loadedSettings.profilePhoto);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (editingPhoto) {
        setEditingPhoto(null);
        return;
      }
      if (pickingFor) setPickingFor(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pickingFor, editingPhoto]);

  const unassignedPhotos = photos.filter((photo) => isUnassignedSection(photo.section));
  const filteredPhotos =
    activeTab === 'all'
      ? photos
      : activeTab === UNASSIGNED_SECTION
        ? unassignedPhotos
        : photos.filter((photo) => photo.section === activeTab);

  const sectionLabel = (sectionId) => {
    if (isUnassignedSection(sectionId)) return 'Unassigned';
    return sections.find((section) => section.id === sectionId)?.label || 'Unassigned';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPhoto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({
      ...prev,
      [name]: value,
      id: name === 'label' ? value.toLowerCase().replace(/\s+/g, '-') : prev.id,
    }));
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.url) {
      flash('Please provide an image URL', true);
      return;
    }

    try {
      await addPhoto({
        url: newPhoto.url,
        section: newPhoto.section || UNASSIGNED_SECTION,
        title: newPhoto.title || 'Untitled',
        alt: newPhoto.alt || 'Photography image',
        timestamp: new Date().toISOString(),
      });
      setNewPhoto({ title: '', section: newPhoto.section, alt: '', url: '' });
      setPhotos(await getPhotos());
      flash('Photo added. Assign a column when you are ready.');
    } catch (err) {
      console.error('Error adding photo:', err);
      flash('Failed to add photo. Please try again.', true);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSection.label) {
      flash('Enter a column name', true);
      return;
    }
    if (sections.some((section) => section.id === newSection.id)) {
      flash('That column already exists', true);
      return;
    }
    try {
      const addedSection = await addSection({ id: newSection.id, label: newSection.label });
      setSections((prev) => [...prev, addedSection]);
      setNewSection({ id: '', label: '' });
      flash('Column added.');
    } catch (err) {
      console.error('Error adding section:', err);
      flash('Error adding column. Please try again.', true);
    }
  };

  const handleDeletePhoto = async (photoId, photoURL, extraUrls = {}) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      const storageUrls = [photoURL, extraUrls.thumbnailUrl, extraUrls.fullUrl]
        .filter((url, index, list) => url && list.indexOf(url) === index);
      for (const url of storageUrls) {
        if (url.includes('firebasestorage.googleapis.com')) {
          try {
            await deletePhoto(url);
          } catch (storageError) {
            console.error('Error deleting storage file:', storageError);
          }
        }
      }
      await deletePhotoFromDb(photoId);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      flash('Photo deleted.');
    } catch (err) {
      console.error('Error deleting photo:', err);
      flash('Failed to delete photo. Please try again.', true);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Delete this column? Photos in it will wait in Unassigned until you place them again.')) {
      return;
    }
    try {
      setSections((prev) => prev.filter((section) => section.id !== id));
      const photosToUpdate = photos.filter((photo) => photo.section === id);
      if (photosToUpdate.length > 0) {
        setPhotos((prev) =>
          prev.map((photo) =>
            photo.section === id ? { ...photo, section: UNASSIGNED_SECTION } : photo
          )
        );
        for (const photo of photosToUpdate) {
          try {
            await updatePhotoSection(photo.id, UNASSIGNED_SECTION);
          } catch (err) {
            console.error(`Failed to update photo ${photo.id}:`, err);
          }
        }
      }
      await deleteSection(id);
      if (activeTab === id) setActiveTab(UNASSIGNED_SECTION);
      flash('Column deleted. Photos are waiting in Unassigned.');
    } catch (err) {
      console.error('Error deleting section:', err);
      flash(err.message || 'Error deleting column.', true);
      try {
        setSections(gallerySectionsOnly(await getSections()));
      } catch (reloadError) {
        console.error('Failed to reload sections after error:', reloadError);
      }
    }
  };

  const togglePicking = (target) => {
    setPickingFor((prev) => (prev === target ? null : target));
  };

  const applyPickedPhoto = async (photo) => {
    if (!pickingFor) return;
    const url = photoFull(photo);
    try {
      if (pickingFor === 'profile') {
        setSelectedProfilePhoto(url);
        await updateProfilePhoto(url);
        flash('Profile photo updated.');
      } else if (pickingFor.startsWith('home-')) {
        const index = Number(pickingFor.slice(5));
        const next = [...selectedHomepagePhotos];
        next[index] = url;
        setSelectedHomepagePhotos(next);
        await updateHomepagePhotos(next);
        flash(`Homepage photo ${index + 1} updated.`);
      }
      setPickingFor(null);
    } catch (err) {
      console.error('Error updating featured photo:', err);
      flash('Could not update that photo. Please try again.', true);
    }
  };

  const openEditor = (photo) => {
    setPickingFor(null);
    setEditingPhoto(photo);
    setEditDraft({
      title: photo.title || '',
      description: photo.description || photo.alt || '',
      section: isUnassignedSection(photo.section) ? '' : photo.section,
    });
  };

  const handlePhotoClick = (photo) => {
    if (pickingFor) {
      applyPickedPhoto(photo);
      return;
    }
    openEditor(photo);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSavingEdit(true);
    try {
      const patch = await updatePhoto(editingPhoto.id, {
        title: editDraft.title,
        description: editDraft.description,
        section: editDraft.section,
      });
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === editingPhoto.id ? { ...photo, ...patch } : photo
        )
      );
      setEditingPhoto(null);
      flash('Photo details saved.');
    } catch (err) {
      console.error('Error saving photo details:', err);
      flash(err.message || 'Could not save photo details.', true);
    } finally {
      setSavingEdit(false);
    }
  };

  const pickingLabel =
    pickingFor === 'profile'
      ? 'Click a photo below to set the profile picture. Esc to cancel.'
      : pickingFor?.startsWith('home-')
        ? `Click a photo below to set homepage ${Number(pickingFor.slice(5)) + 1}. Esc to cancel.`
        : '';

  if (isLoading) {
    return (
      <div className="admin" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p>Loading...</p>
        {error && <p className="admin-error">{error}</p>}
      </div>
    );
  }

  return (
    <section className="admin fade-in">
      <div className="admin-header">
        <button
          type="button"
          className="admin-logout"
          onClick={() => {
            logout();
            if (onLogout) onLogout();
          }}
        >
          Log Out
        </button>
        <h2>Admin Panel</h2>
        <p className="admin-help" style={{ margin: '0 auto' }}>
          Upload anytime. Photos wait here until you assign a gallery column.
        </p>
      </div>

      {showSuccess && <div className="admin-toast">{showSuccess}</div>}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card">
        <h3>Homepage &amp; profile</h3>
        <p className="admin-help">Click a slot, then click any photo below. It saves right away.</p>
        <div className="admin-home-row">
          {selectedHomepagePhotos.map((photoUrl, index) => {
            const id = `home-${index}`;
            return (
              <button
                type="button"
                key={id}
                className={`admin-slot${pickingFor === id ? ' is-active' : ''}`}
                onClick={() => togglePicking(id)}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="" />
                ) : (
                  <div className="admin-slot-empty">Click to choose</div>
                )}
                <span className="admin-slot-label">Homepage {index + 1}</span>
              </button>
            );
          })}
          <button
            type="button"
            className={`admin-profile${pickingFor === 'profile' ? ' is-active' : ''}`}
            onClick={() => togglePicking('profile')}
          >
            {selectedProfilePhoto ? (
              <img src={selectedProfilePhoto} alt="" />
            ) : (
              <div className="admin-profile-empty">Profile</div>
            )}
          </button>
        </div>
        {pickingFor && <div className="admin-picking">{pickingLabel}</div>}
      </div>

      <div className="admin-card">
        <div className="admin-upload-row">
          <div>
            <h3>Upload photos</h3>
            <p className="admin-help">
              Drop files now. Leave the column blank if you want to sort them later.
            </p>
            <label className="admin-field" htmlFor="uploadSection">
              Column (optional)
            </label>
            <select
              id="uploadSection"
              name="section"
              className="admin-select"
              value={newPhoto.section}
              onChange={handleInputChange}
            >
              <option value="">Unassigned — sort later</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
            <PhotoUpload
              section={newPhoto.section}
              onUploadComplete={async () => {
                setPhotos(await getPhotos());
                flash(newPhoto.section ? 'Photo(s) uploaded.' : 'Uploaded. Assign a column when you are ready.');
              }}
            />
            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.85rem', opacity: 0.65 }}>
                Or paste an image link
              </summary>
              <form onSubmit={handleAddPhoto} style={{ marginTop: 16 }}>
                <input
                  className="admin-input"
                  type="text"
                  name="title"
                  value={newPhoto.title}
                  onChange={handleInputChange}
                  placeholder="Photo title"
                />
                <input
                  className="admin-input"
                  type="text"
                  name="url"
                  value={newPhoto.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                />
                <button type="submit">ADD FROM LINK</button>
              </form>
            </details>
          </div>

          <div>
            <h3>Gallery columns</h3>
            <p className="admin-help">These become the filters on the public portfolio. Zero is fine.</p>
            <form onSubmit={handleAddSection}>
              <label className="admin-field" htmlFor="sectionLabel">Column name</label>
              <input
                className="admin-input"
                type="text"
                id="sectionLabel"
                name="label"
                value={newSection.label}
                onChange={handleSectionInputChange}
                placeholder="e.g. Porsche Meet"
              />
              <button type="submit">ADD COLUMN</button>
            </form>
            <div className="admin-columns-list" style={{ marginTop: 16 }}>
              {sections.length === 0 ? (
                <p className="admin-empty">No columns yet. Uploaded photos will wait in Unassigned.</p>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="admin-column">
                    <span>{section.label}</span>
                    <button type="button" onClick={() => handleDeleteSection(section.id)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Photos</h3>
        <p className="admin-help">
          Click a photo to edit its title and description. Unassigned photos stay here only — they do not show on the public gallery until you pick a column.
        </p>
        <div className="admin-filters">
          <button
            type="button"
            className={`admin-chip${activeTab === 'all' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="admin-chip-count">{photos.length}</span>
          </button>
          <button
            type="button"
            className={`admin-chip${activeTab === UNASSIGNED_SECTION ? ' is-active' : ''}`}
            onClick={() => setActiveTab(UNASSIGNED_SECTION)}
          >
            Unassigned <span className="admin-chip-count">{unassignedPhotos.length}</span>
          </button>
          {sections.map((section) => {
            const count = photos.filter((photo) => photo.section === section.id).length;
            return (
              <button
                type="button"
                key={section.id}
                className={`admin-chip${activeTab === section.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(section.id)}
              >
                {section.label} <span className="admin-chip-count">{count}</span>
              </button>
            );
          })}
        </div>

        {filteredPhotos.length === 0 ? (
          <p className="admin-empty">No photos in this view yet.</p>
        ) : (
          <div className="admin-photo-grid">
            {filteredPhotos.map((photo) => {
              const unassigned = isUnassignedSection(photo.section);
              return (
                <div
                  key={photo.id}
                  className={`admin-photo${unassigned ? ' is-unassigned' : ''}${pickingFor ? ' is-pickable' : ''}`}
                >
                  <img
                    src={photoThumb(photo)}
                    alt=""
                    loading="lazy"
                    onClick={() => handlePhotoClick(photo)}
                  />
                  <div className="admin-photo-bar" onClick={(e) => e.stopPropagation()}>
                    <span className="admin-photo-col">
                      {unassigned ? 'Unassigned' : sectionLabel(photo.section)}
                    </span>
                    <button type="button" className="admin-photo-edit" onClick={() => openEditor(photo)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-photo-delete"
                      onClick={() =>
                        handleDeletePhoto(photo.id, photo.url, {
                          thumbnailUrl: photo.thumbnailUrl,
                          fullUrl: photo.fullUrl,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingPhoto && (
        <div className="admin-modal-backdrop" onClick={() => setEditingPhoto(null)}>
          <form
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEdit}
          >
            <h3>Edit photo</h3>
            <p className="admin-help">Title, description, and column. Title and description show when someone clicks the photo on the site.</p>
            <img className="admin-modal-preview" src={photoThumb(editingPhoto)} alt="" />
            <label className="admin-field" htmlFor="editSection">Column</label>
            <select
              id="editSection"
              className="admin-select"
              value={editDraft.section}
              onChange={(e) => setEditDraft((prev) => ({ ...prev, section: e.target.value }))}
            >
              <option value="">Unassigned — sort later</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
            <label className="admin-field" htmlFor="editTitle">Title</label>
            <input
              id="editTitle"
              className="admin-input"
              type="text"
              value={editDraft.title}
              onChange={(e) => setEditDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Photo title"
            />
            <label className="admin-field" htmlFor="editDescription">Description</label>
            <textarea
              id="editDescription"
              className="admin-textarea"
              rows={4}
              value={editDraft.description}
              onChange={(e) => setEditDraft((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="What should people read when they open this photo?"
            />
            <div className="admin-modal-actions">
              <button type="button" className="admin-chip" onClick={() => setEditingPhoto(null)}>
                Cancel
              </button>
              <button type="submit" disabled={savingEdit}>
                {savingEdit ? 'SAVING…' : 'SAVE'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
