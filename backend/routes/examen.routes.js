// routes/examens.routes.js
const express = require("express");
const router = express.Router();
const {
  Examen,
  ResultatExamen,
  Utilisateur,
  Consultation,
  Patient,
} = require("../models");
const PDFDocument = require("pdfkit");
const auth = require("../middlewares/auth.middleware");

// =========================
// 📋 CRUD examens
// =========================

// GET /api/examens
router.get(
  "/",
  auth(["admin", "medecin", "laborantin"]),
  async (req, res) => {
    try {
      const { statut, type_examen, medecin_id, laborantin_id } = req.query;
      const where = {};
      if (statut) where.statut = statut;
      if (type_examen) where.type_examen = type_examen;
      if (medecin_id) where.medecin_id = medecin_id;
      if (laborantin_id) where.laborantin_id = laborantin_id;

      const examens = await Examen.findAll({
        where,
        include: [
          {
            model: Consultation,
            as: "consultation",
            include: [{ model: Patient, as: "patient" }],
          },
          { model: Utilisateur, as: "medecin" },
          { model: Utilisateur, as: "laborantin" },
          { model: ResultatExamen, as: "resultats" },
        ],
      });
      res.json(examens);
    } catch (error) {
      console.error("Erreur GET examens:", error);
      res.status(500).json({ error: "Impossible de charger les examens" });
    }
  }
);

// GET /api/examens/:id
router.get(
  "/:id",
  auth(["admin", "medecin", "laborantin"]),
  async (req, res) => {
    try {
      const examen = await Examen.findByPk(req.params.id, {
        include: [
          {
            model: Consultation,
            as: "consultation",
            include: [{ model: Patient, as: "patient" }],
          },
          { model: Utilisateur, as: "medecin" },
          { model: Utilisateur, as: "laborantin" },
          { model: ResultatExamen, as: "resultats" },
        ],
      });
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });
      res.json(examen);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

// POST /api/examens
router.post(
  "/",
  auth(["admin", "medecin", "laborantin"]),
  async (req, res) => {
    try {
      const payload = { ...req.body };

      // 👨‍⚕️ si un médecin prescrit
      if (req.user.role === "medecin") {
        payload.medecin_id = req.user.id;
      }

      // 👨‍🔬 si un laborantin crée un examen (rare, mais possible)
      if (req.user.role === "laborantin") {
        payload.laborantin_id = req.user.id;
      }

      const examen = await Examen.create(payload);
      res.status(201).json(examen);
    } catch (error) {
      console.error("Erreur POST examen:", error);
      res.status(500).json({ error: "Impossible de créer l'examen" });
    }
  }
);

// PUT /api/examens/:id
router.put(
  "/:id",
  auth(["admin", "medecin", "laborantin"]),
  async (req, res) => {
    try {
      const examen = await Examen.findByPk(req.params.id);
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });
      await examen.update(req.body);
      res.json(examen);
    } catch (error) {
      res.status(500).json({ error: "Impossible de modifier l'examen" });
    }
  }
);

// DELETE /api/examens/:id
router.delete(
  "/:id",
  auth(["admin"]),
  async (req, res) => {
    try {
      const examen = await Examen.findByPk(req.params.id);
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });
      await examen.destroy();
      res.json({ message: "Examen supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Impossible de supprimer l'examen" });
    }
  }
);

// =========================
// 🔬 Résultats examens
// =========================

// POST /api/examens/:id/resultats
router.post(
  "/:id/resultats",
  auth(["laborantin", "admin"]),
  async (req, res) => {
    try {
      const { parametres } = req.body;
      const examen = await Examen.findByPk(req.params.id);
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });

      await ResultatExamen.destroy({ where: { examen_id: examen.id } });

      const resultats = await Promise.all(
        parametres.map((p) =>
          ResultatExamen.create({ examen_id: examen.id, ...p })
        )
      );

      // 👨‍🔬 associer le laborantin qui saisit les résultats
      examen.statut = "valide";
      examen.laborantin_id = req.user.id;
      await examen.save();

      res.json({ message: "Résultats enregistrés", resultats });
    } catch (error) {
      console.error("Erreur POST resultats:", error);
      res.status(500).json({ error: "Impossible d'enregistrer les résultats" });
    }
  }
);

// PUT /api/examens/resultats/:id
router.put(
  "/resultats/:id",
  auth(["laborantin", "admin"]),
  async (req, res) => {
    try {
      const resultat = await ResultatExamen.findByPk(req.params.id);
      if (!resultat) return res.status(404).json({ error: "Résultat non trouvé" });
      await resultat.update(req.body);
      res.json(resultat);
    } catch (error) {
      res.status(500).json({ error: "Impossible de modifier le résultat" });
    }
  }
);

// =========================
// 🧑‍⚕️ Interprétation par le médecin
// =========================
router.put(
  "/:id/interpreter",
  auth(["medecin", "admin"]),
  async (req, res) => {
    try {
      const { observations } = req.body;
      const examen = await Examen.findByPk(req.params.id);
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });

      examen.observations = observations || "";
      examen.statut = "valide";
      await examen.save();

      res.json({ message: "Examen interprété avec succès", examen });
    } catch (error) {
      res.status(500).json({ error: "Impossible d'interpréter l'examen" });
    }
  }
);

// =========================
// 📄 Génération PDF d’un examen
// =========================
router.get(
  "/:id/pdf",
  auth(["admin", "medecin", "laborantin"]),
  async (req, res) => {
    try {
      const examen = await Examen.findByPk(req.params.id, {
        include: [
          {
            model: Consultation,
            as: "consultation",
            include: [{ model: Patient, as: "patient" }],
          },
          { model: Utilisateur, as: "medecin" },
          { model: Utilisateur, as: "laborantin" },
          { model: ResultatExamen, as: "resultats" },
        ],
      });
      if (!examen) return res.status(404).json({ error: "Examen non trouvé" });

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=examen_${examen.id}.pdf`
      );

      doc.pipe(res);
      doc.fontSize(18).text("Rapport d'Examen Médical", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`ID Examen : ${examen.id}`);
      doc.text(`Type : ${examen.type_examen}`);
      doc.text(`Statut : ${examen.statut}`);
      doc.text(`Date prescription : ${examen.date_prescription}`);
      if (examen.medecin)
        doc.text(`Médecin prescripteur : ${examen.medecin.noms}`);
      if (examen.laborantin)
        doc.text(`Laborantin : ${examen.laborantin.noms}`);
      if (examen.observations) doc.text(`Observations : ${examen.observations}`);

      doc.moveDown().text("Résultats :", { underline: true });
      examen.resultats.forEach((r) => {
        doc.text(`- ${r.parametre}: ${r.valeur} ${r.unite || ""}`);
      });

      doc.end();
    } catch (error) {
      console.error("Erreur PDF:", error);
      res.status(500).json({ error: "Impossible de générer le PDF" });
    }
  }
);

module.exports = router;
