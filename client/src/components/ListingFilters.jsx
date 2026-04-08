import { BRANDS, CAR_MODELS, FUEL_TYPES, TRANSMISSIONS } from '../data/options';

export default function ListingFilters({ filters, onChange, onReset }) {
  const models = filters.brand ? (CAR_MODELS[filters.brand] || []) : [];

  return (
    <aside className="filters card">
      <h3>Filtre</h3>

      <div className="form-grid form-grid--single">
        <input
          name="search"
          placeholder="Caută după titlu, marcă, model"
          value={filters.search}
          onChange={onChange}
        />

        <select name="brand" value={filters.brand} onChange={onChange}>
          <option value="">Toate mărcile</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select name="model" value={filters.model} onChange={onChange} disabled={!filters.brand}>
          <option value="">Toate modelele</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        <select name="fuelType" value={filters.fuelType} onChange={onChange}>
          <option value="">Toate tipurile de combustibil</option>
          {FUEL_TYPES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select name="transmission" value={filters.transmission} onChange={onChange}>
          <option value="">Toate transmisiile</option>
          {TRANSMISSIONS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input name="city" placeholder="Oraș" value={filters.city} onChange={onChange} />

        <input name="minPrice" type="number" min="0" max="1000000" placeholder="Preț minim" value={filters.minPrice} onChange={onChange} />
        <input name="maxPrice" type="number" min="0" max="1000000" placeholder="Preț maxim" value={filters.maxPrice} onChange={onChange} />
        <input name="minYear" type="number" min="1980" max="2035" placeholder="An minim" value={filters.minYear} onChange={onChange} />
        <input name="maxYear" type="number" min="1980" max="2035" placeholder="An maxim" value={filters.maxYear} onChange={onChange} />
        <input name="maxMileage" type="number" min="0" max="1000000" placeholder="Km maximi" value={filters.maxMileage} onChange={onChange} />

        <select name="sort" value={filters.sort} onChange={onChange}>
          <option value="latest">Cele mai noi</option>
          <option value="price_asc">Preț crescător</option>
          <option value="price_desc">Preț descrescător</option>
          <option value="year_desc">An descrescător</option>
          <option value="year_asc">An crescător</option>
          <option value="mileage_asc">Kilometraj crescător</option>
          <option value="mileage_desc">Kilometraj descrescător</option>
          <option value="relevance">Relevanță</option>
        </select>
      </div>

      <button className="btn btn--ghost" type="button" onClick={onReset}>
        Resetează filtrele
      </button>
    </aside>
  );
}