import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    noms: "",
    matricule: "",
    grade: "",
    fonction: "",
    service: "",
    email: "",
    mot_de_passe: "",
    role: "medecin",
    photo: "",
    observation: "",
    statut: "actif",
  });

  // 🔹 Fetch utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers(token);
      console.log("Fetched users:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err.error || "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Tri
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key] || "";
    const valB = b[sortConfig.key] || "";
    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  // 🔹 Filtrage + recherche
  const filteredUsers = sortedUsers
    .filter((u) => (filterRole ? u.role === filterRole : true))
    .filter((u) => (filterStatus ? u.statut === filterStatus : true))
    .filter((u) =>
      searchTerm
        ? u.noms.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.matricule || "").toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 🔹 Création / Mise à jour utilisateur
  const handleCreateOrUpdate = async (e) => {
  e.preventDefault();
  console.log("ID AVANT UPDATE:", editingUser?.id, typeof editingUser?.id);
  setError("");

  if (!editingUser && !form.mot_de_passe) {
    setError("Le mot de passe est obligatoire pour un nouvel utilisateur.");
    return;
  }

  try {
    if (editingUser) {
      // ✅ Conversion sûre de l'ID
      const userId = Number(editingUser.id);
      if (isNaN(userId)) {
        setError("ID utilisateur invalide");
        return;
      }
      console.log("Updating user:", userId, form, photoFile);
      await updateUser(userId, form, photoFile); // envoie toujours un ID numérique
    } else {
      console.log("Creating user:", form, photoFile);
      await createUser(form, photoFile);
    }
    resetForm();
    fetchUsers();
  } catch (err) {
    console.error("Erreur create/update:", err);

    if (err.response) {
      if (err.response.status === 400) {
        setError(err.response.data.message || "Champs requis manquants");
      } else if (err.response.status === 401) {
        setError("Non authentifié, veuillez vous reconnecter");
      } else if (err.response.status === 403) {
        setError(
          "Accès refusé : seuls les administrateurs peuvent créer/modifier un utilisateur"
        );
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur serveur inconnue");
      }
    } else if (err.request) {
      setError("Impossible de contacter le serveur");
    } else {
      setError("Erreur inattendue : " + err.message);
    }
  }
};

  const resetForm = () => {
    setForm({
      noms: "",
      matricule: "",
      grade: "",
      fonction: "",
      service: "",
      email: "",
      mot_de_passe: "",
      role: "medecin",
      observation: "",
      statut: "actif",
      photo: "",
    });
    setEditingUser(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowForm(false);
  };

  // 🔹 Modifier un utilisateur
  const handleEdit = (user) => {
  console.log("USER REÇU POUR EDIT:", user);

  // ✅ ID sécurisé UNE FOIS POUR TOUTES
  const safeUser = {
    ...user,
    id: Number(user.id),
  };

  if (isNaN(safeUser.id)) {
    setError("Utilisateur invalide (ID non numérique)");
    return;
  }

  setEditingUser(safeUser);

  setForm({
    noms: user.noms || "",
    matricule: user.matricule || "",
    grade: user.grade || "",
    fonction: user.fonction || "",
    service: user.service || "",
    email: user.email || "",
    mot_de_passe: "",
    role: user.role || "medecin",
    observation: user.observation || "",
    statut: user.statut || "actif",
  });

  setPhotoFile(null);
  setPhotoPreview(user.photo || null);
  setShowForm(true);
};

  const handleDelete = async (user) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
  try {
    // ✅ Conversion sûre de l'ID
    const userId = Number(user.id);
    if (isNaN(userId)) {
      setError("ID utilisateur invalide pour suppression");
      return;
    }
    console.log("Deleting user ID:", userId);
    await deleteUser(userId); // envoie toujours un ID numérique
    fetchUsers();
  } catch (err) {
    console.error(err);
    setError(err.error || "Erreur lors de la suppression");
  }
};

  const handleResetPassword = async (user) => {
  const userId = Number(user.id);
  if (isNaN(userId)) {
    setError("ID utilisateur invalide pour reset du mot de passe");
    return;
  }

  const newPassword = window.prompt(`Nouveau mot de passe pour ${user.noms}:`);
  if (!newPassword) return;
  try {
    console.log("Resetting password for user ID:", userId);
    await resetPassword(userId, newPassword); // ID toujours numérique
    alert("Mot de passe réinitialisé avec succès !");
  } catch (err) {
    console.error(err);
    setError(err.error || "Erreur lors du reset du mot de passe");
  }
};

  // 🔹 Gestion upload photo / caméra
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Uploaded photo file:", file);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.png`, {
          type: "image/png",
        });
        console.log("Captured photo file:", file);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      });

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Camera error:", err);
      alert("Impossible d'accéder à la caméra");
    }
  };

  return (
    <div className="p-4">
      {/* Retour */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          ← Retour
        </button>
      </div>

      {/* Titre et création */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Nouvel utilisateur
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="mb-4 bg-white p-4 rounded shadow">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="noms"
              placeholder="Nom complet"
              value={form.noms}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="matricule"
              placeholder="Matricule"
              value={form.matricule}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="grade"
              placeholder="Grade"
              value={form.grade}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="fonction"
              placeholder="Fonction"
              value={form.fonction}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="service"
              placeholder="Service"
              value={form.service}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="mot_de_passe"
              placeholder="Mot de passe"
              type="password"
              value={form.mot_de_passe}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="medecin">Médecin</option>
              <option value="infirmier">Infirmier</option>
              <option value="pharmacien">Pharmacien</option>
              <option value="receptionniste">Réceptionniste</option>
              <option value="laborantin">Laborantin</option>
              <option value="chef de service">Chef de service</option>
              <option value="secretaire">Secrétaire</option>
            </select>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
            <textarea
              name="observation"
              placeholder="Observations"
              value={form.observation}
              onChange={handleChange}
              className="p-2 border rounded md:col-span-2"
            />

            {/* Upload photo */}
            <div className="md:col-span-2 flex gap-2 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-gray-300 px-2 py-1 rounded"
              >
                Télécharger photo
              </button>
              <button
                type="button"
                onClick={handleTakePhoto}
                className="bg-gray-500 text-white px-2 py-1 rounded"
              >
                Prendre photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
              {editingUser ? "Mettre à jour" : "Créer"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Recherche */}
      <div className="flex gap-2 mb-2">
        <input
          placeholder="Rechercher par nom, email ou matricule"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="medecin">Médecin</option>
          <option value="infirmier">Infirmier</option>
          <option value="pharmacien">Pharmacien</option>
          <option value="laborantin">Laborantin</option>
          <option value="receptionniste">Réceptionniste</option>
          <option value="chef de service">Chef de service</option>
          <option value="secretaire">Secrétaire</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Chargement...</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 cursor-pointer">
              <tr>
                {[
                  "id",
                  "noms",
                  "matricule",
                  "grade",
                  "fonction",
                  "service",
                  "email",
                  "role",
                  "statut",
                  "date_creation",
                  "observation",
                ].map((col) => (
                  <th key={col} className="p-2 text-left" onClick={() => handleSort(col)}>
                    {col.toUpperCase()}
                  </th>
                ))}
                <th className="p-2 text-left">Photo</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="14" className="p-4 text-center text-gray-500">
                    Aucun utilisateur
                  </td>
                </tr>
              )}
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.noms}</td>
                  <td className="p-2">{u.matricule || "-"}</td>
                  <td className="p-2">{u.grade || "-"}</td>
                  <td className="p-2">{u.fonction || "-"}</td>
                  <td className="p-2">{u.service || "-"}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.statut}</td>
                  <td className="p-2">
                    {u.date_creation ? new Date(u.date_creation).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-2">{u.observation || "-"}</td>
                  <td className="p-2">
                    {u.photo && (
                      <img src={u.photo} alt="User" className="w-10 h-10 object-cover rounded" />
                    )}
                  </td>
                  <td className="p-2 space-x-1">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => handleResetPassword(u)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Reset MDp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-2 flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-2 py-1 border rounded"
        >
          Préc
        </button>
        <span className="px-2 py-1">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 border rounded"
        >
          Suiv
        </button>
      </div>
    </div>
  );
}
