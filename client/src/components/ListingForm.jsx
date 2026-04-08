import { useEffect, useMemo, useState } from 'react';
import http from '../api/http';
import { BRANDS, CAR_MODELS, FUEL_TYPES, TRANSMISSIONS } from '../data/options';

const initialState = {
  title: '',
  description: '',
  brand: BRANDS[0],
  model: CAR_MODELS[BRANDS[0]][0],
  year: 2018,
  price: 10000,
  mileage: 100000,
  fuelType: FUEL_TYPES[0],
  transmission: TRANSMISSIONS[0],
  color: '',
  engine: '',
  horsepower: 120,
  locationCity: '',
  featuredImage: '',
  gallery: [],
  contactName: '',
  contactEmail: '',
  contactPhone: ''
};

export default function ListingForm({
  initialValues,
  onSubmit,
  submitLabel = 'Salvează anunțul',
  loading = false
}) {
  const [form, setForm] = useState(() => ({ ...initialState, ...mapInitialValues(initialValues) }));
  const [errors, setErrors] = useState({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const modelsForSelectedBrand = useMemo(
    () => CAR_MODELS[form.brand] || [],
    [form.brand]
  );

  useEffect(() => {
    if (!modelsForSelectedBrand.includes(form.model)) {
      setForm((prev) => ({
        ...prev,
        model: modelsForSelectedBrand[0] || ''
      }));
    }
  }, [form.brand, form.model, modelsForSelectedBrand]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (['year', 'price', 'mileage', 'horsepower'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function uploadSingleImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  }

  async function handleFeaturedImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMain(true);
      const uploadedUrl = await uploadSingleImage(file);
      setForm((prev) => ({ ...prev, featuredImage: uploadedUrl }));
    } catch (error) {
      alert(error.response?.data?.message || 'Nu am putut încărca imaginea principală.');
    } finally {
      setUploadingMain(false);
    }
  }

  async function handleGalleryUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (form.gallery.length + files.length > 12) {
      alert('Poți avea maxim 12 imagini în galerie.');
      return;
    }

    try {
      setUploadingGallery(true);
      const uploadedUrls = [];
      for (const file of files) {
        const uploadedUrl = await uploadSingleImage(file);
        uploadedUrls.push(uploadedUrl);
      }

      setForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls]
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Nu am putut încărca una sau mai multe imagini.');
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(index) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.title || form.title.trim().length < 10) nextErrors.title = 'Titlul trebuie să aibă minim 10 caractere.';
    if (!form.description || form.description.trim().length < 30) nextErrors.description = 'Descrierea trebuie să aibă minim 30 de caractere.';
    if (!form.brand) nextErrors.brand = 'Marca este obligatorie.';
    if (!form.model) nextErrors.model = 'Modelul este obligatoriu.';
    if (!form.year || form.year < 1980 || form.year > new Date().getFullYear() + 1) nextErrors.year = 'An invalid.';
    if (!form.price || form.price < 100) nextErrors.price = 'Prețul trebuie să fie de minim 100.';
    if (form.mileage < 0 || form.mileage > 1000000) nextErrors.mileage = 'Kilometraj invalid.';
    if (!form.color || form.color.trim().length < 2) nextErrors.color = 'Culoarea este obligatorie.';
    if (!form.engine || form.engine.trim().length < 2) nextErrors.engine = 'Motorul este obligatoriu.';
    if (!form.horsepower || form.horsepower < 30 || form.horsepower > 2000) nextErrors.horsepower = 'Număr invalid de cai putere.';
    if (!form.locationCity || form.locationCity.trim().length < 2) nextErrors.locationCity = 'Orașul este obligatoriu.';
    if (!form.featuredImage) nextErrors.featuredImage = 'Imaginea principală este obligatorie.';
    if (!form.contactName || form.contactName.trim().length < 2) nextErrors.contactName = 'Numele de contact este obligatoriu.';
    if (!form.contactEmail || !/\S+@\S+\.\S+/.test(form.contactEmail)) nextErrors.contactEmail = 'Emailul de contact este invalid.';
    if (!form.contactPhone || form.contactPhone.trim().length < 6) nextErrors.contactPhone = 'Telefonul de contact este invalid.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      color: form.color.trim(),
      engine: form.engine.trim(),
      locationCity: form.locationCity.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      gallery: form.gallery
    });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Titlu
          <input name="title" value={form.title} onChange={handleChange} maxLength={120} required />
          {errors.title && <small className="field-error">{errors.title}</small>}
        </label>

        <label>
          Marcă
          <select name="brand" value={form.brand} onChange={handleChange}>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          {errors.brand && <small className="field-error">{errors.brand}</small>}
        </label>

        <label>
          Model
          <select name="model" value={form.model} onChange={handleChange}>
            {modelsForSelectedBrand.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {errors.model && <small className="field-error">{errors.model}</small>}
        </label>

        <label>
          An
          <input name="year" type="number" min="1980" max="2035" value={form.year} onChange={handleChange} required />
          {errors.year && <small className="field-error">{errors.year}</small>}
        </label>

        <label>
          Preț
          <input name="price" type="number" min="100" max="1000000" value={form.price} onChange={handleChange} required />
          {errors.price && <small className="field-error">{errors.price}</small>}
        </label>

        <label>
          Kilometraj
          <input name="mileage" type="number" min="0" max="1000000" value={form.mileage} onChange={handleChange} required />
          {errors.mileage && <small className="field-error">{errors.mileage}</small>}
        </label>

        <label>
          Combustibil
          <select name="fuelType" value={form.fuelType} onChange={handleChange}>
            {FUEL_TYPES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Transmisie
          <select name="transmission" value={form.transmission} onChange={handleChange}>
            {TRANSMISSIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Culoare
          <input name="color" value={form.color} onChange={handleChange} maxLength={30} required />
          {errors.color && <small className="field-error">{errors.color}</small>}
        </label>

        <label>
          Motor
          <input name="engine" value={form.engine} onChange={handleChange} maxLength={50} required />
          {errors.engine && <small className="field-error">{errors.engine}</small>}
        </label>

        <label>
          Cai putere
          <input name="horsepower" type="number" min="30" max="2000" value={form.horsepower} onChange={handleChange} required />
          {errors.horsepower && <small className="field-error">{errors.horsepower}</small>}
        </label>

        <label>
          Oraș
          <input name="locationCity" value={form.locationCity} onChange={handleChange} maxLength={60} required />
          {errors.locationCity && <small className="field-error">{errors.locationCity}</small>}
        </label>

        <label>
          Nume contact
          <input name="contactName" value={form.contactName} onChange={handleChange} maxLength={80} required />
          {errors.contactName && <small className="field-error">{errors.contactName}</small>}
        </label>

        <label>
          Email contact
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} required />
          {errors.contactEmail && <small className="field-error">{errors.contactEmail}</small>}
        </label>

        <label>
          Telefon contact
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange} maxLength={30} required />
          {errors.contactPhone && <small className="field-error">{errors.contactPhone}</small>}
        </label>

        <label className="full-width">
          Imagine principală
          <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} />
          {uploadingMain && <small>Se încarcă imaginea principală...</small>}
          {form.featuredImage && <img src={form.featuredImage} alt="Preview" className="upload-preview" />}
          {errors.featuredImage && <small className="field-error">{errors.featuredImage}</small>}
        </label>

        <label className="full-width">
          Galerie imagini
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
          {uploadingGallery && <small>Se încarcă imaginile din galerie...</small>}
          <div className="gallery-upload-grid">
            {form.gallery.map((image, index) => (
              <div key={`${image}-${index}`} className="gallery-upload-item">
                <img src={image} alt={`Galerie ${index + 1}`} className="gallery-upload-thumb" />
                <button type="button" className="btn btn--ghost" onClick={() => removeGalleryImage(index)}>
                  Șterge
                </button>
              </div>
            ))}
          </div>
        </label>

        <label className="full-width">
          Descriere
          <textarea name="description" rows="6" value={form.description} onChange={handleChange} maxLength={3000} required />
          {errors.description && <small className="field-error">{errors.description}</small>}
        </label>
      </div>

      <button className="btn" disabled={loading || uploadingMain || uploadingGallery}>
        {loading ? 'Se salvează...' : submitLabel}
      </button>
    </form>
  );
}

function mapInitialValues(initialValues) {
  if (!initialValues) return {};

  return {
    ...initialValues,
    gallery: Array.isArray(initialValues.gallery) ? initialValues.gallery : [],
    contactName: initialValues.contactName || '',
    contactEmail: initialValues.contactEmail || '',
    contactPhone: initialValues.contactPhone || ''
  };
}