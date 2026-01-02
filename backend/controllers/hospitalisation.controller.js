const { Hospitalisation, Patient, Medecin, Infirmier } = require("../models");

exports.createHospitalisation = async (req, res) => {
  try {
    const data = await Hospitalisation.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Erreur createHospitalisation:", err);
    res.status(500).json({ error: "Impossible de créer l'hospitalisation" });
  }
};

exports.getAllHospitalisations = async (req, res) => {
  try {
    const { page = 1, limit = 10, statut } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (statut) where.statut = statut;

    const hospitalisations = await Hospitalisation.findAll({
      where,
      include: [Patient, Medecin, Infirmier],
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["date_entree", "DESC"]],
    });

    res.json({ rows: hospitalisations, count: hospitalisations.length, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error("Erreur getAllHospitalisations:", err);
    res.status(500).json({ error: "Impossible de récupérer les hospitalisations" });
  }
};

exports.getHospitalisationById = async (req, res) => {
  try {
    const h = await Hospitalisation.findByPk(req.params.id, { include: [Patient, Medecin, Infirmier] });
    if (!h) return res.status(404).json({ error: "Hospitalisation non trouvée" });
    res.json(h);
  } catch (err) {
    console.error("Erreur getHospitalisationById:", err);
    res.status(500).json({ error: "Impossible de récupérer l'hospitalisation" });
  }
};

exports.updateHospitalisation = async (req, res) => {
  try {
    const h = await Hospitalisation.findByPk(req.params.id);
    if (!h) return res.status(404).json({ error: "Hospitalisation non trouvée" });

    await h.update(req.body);
    res.json(h);
  } catch (err) {
    console.error("Erreur updateHospitalisation:", err);
    res.status(500).json({ error: "Impossible de mettre à jour l'hospitalisation" });
  }
};

exports.changerStatutHospitalisation = async (req, res) => {
  try {
    const h = await Hospitalisation.findByPk(req.params.id);
    if (!h) return res.status(404).json({ error: "Hospitalisation non trouvée" });

    h.statut = req.body.statut;
    await h.save();

    res.json(h);
  } catch (err) {
    console.error("Erreur changerStatutHospitalisation:", err);
    res.status(500).json({ error: "Impossible de changer le statut" });
  }
};

exports.deleteHospitalisation = async (req, res) => {
  try {
    const h = await Hospitalisation.findByPk(req.params.id);
    if (!h) return res.status(404).json({ error: "Hospitalisation non trouvée" });

    await h.destroy();
    res.json({ message: "Hospitalisation supprimée" });
  } catch (err) {
    console.error("Erreur deleteHospitalisation:", err);
    res.status(500).json({ error: "Impossible de supprimer l'hospitalisation" });
  }
};

exports.getHospitalisationDashboard = async (req, res) => {
  try {
    const total = await Hospitalisation.count();
    const admises = await Hospitalisation.count({ where: { statut: "admise" } });
    const enCours = await Hospitalisation.count({ where: { statut: "en_cours" } });
    const cloturees = await Hospitalisation.count({ where: { statut: "cloturee" } });

    res.json({ total, admises, enCours, cloturees });
  } catch (err) {
    console.error("Erreur getHospitalisationDashboard:", err);
    res.status(500).json({ error: "Impossible de charger le dashboard" });
  }
};
