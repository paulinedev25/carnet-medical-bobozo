import React from "react";

export default function SoinsFilters({
  onFilterChange,
  infirmiers,
  defaultFilters,
}) {
  const handleChange = (e) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-800">
      {/* Filtre par statut */}
      <select
        name="statut"
        onChange={handleChange}
        defaultValue={defaultFilters.statut || ""}
        className="border px-2 py-1 rounded"
      >
        <option value="">Tous statuts</option>
        <option value="en_attente">En attente</option>
        <option value="valide">Validé</option>
        <option value="rejete">Rejeté</option>
      </select>

      {/* Filtre par infirmier */}
      <select
        name="infirmier"
        onChange={handleChange}
        defaultValue={defaultFilters.infirmier || ""}
        className="border px-2 py-1 rounded"
      >
        <option value="">Tous infirmiers</option>
        {infirmiers.map((inf) => (
          <option key={inf.id} value={inf.id}>
            {inf.noms}
          </option>
        ))}
      </select>

      {/* Filtre par période */}
      <div className="flex gap-2">
        <input
          type="date"
          name="dateDebut"
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          name="dateFin"
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}
