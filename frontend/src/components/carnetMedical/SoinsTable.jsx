import { useEffect, useState } from "react";
import { getSoinsByHospitalisation, deleteSoin } from "../../services/soins.service";

export default function SoinsTable({ hospitalisationId }) {
  const [soins, setSoins] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getSoinsByHospitalisation(hospitalisationId);
      setSoins(res.data);
    }
    load();
  }, [hospitalisationId]);

  const handleDelete = async (id) => {
    await deleteSoin(id);
    setSoins((s) => s.filter(x => x.id !== id));
  };

  return (
    <table>
      <thead>
        <tr><th>Date</th><th>Type</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {soins.map(s => (
          <tr key={s.id}>
            <td>{new Date(s.date_soin).toLocaleString()}</td>
            <td>{s.type_soin}</td>
            <td>
              <button onClick={() => handleDelete(s.id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
