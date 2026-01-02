const { Op, Sequelize } = require("sequelize");
const Medicament = require("../models/medicament.model");

/**
 * 🔧 Met à jour le statut de disponibilité selon la quantité
 */
function majStatutDisponibilite(medicament) {
  if (medicament.quantite_disponible === 0) {
    medicament.statut_disponibilite = "rupture";
  } else if (medicament.quantite_disponible <= medicament.seuil_alerte) {
    medicament.statut_disponibilite = "alerte";
  } else {
    medicament.statut_disponibilite = "disponible";
  }
}

/**
 * ➕ Ajouter un médicament
 */
exports.createMedicament = async (req, res) => {
  try {
    console.log("POST /medicaments payload:", req.body);

    const {
      nom_commercial,
      unite_nom_commercial,
      nom_dci,
      unite_nom_dci,
      forme,
      unite_forme,
      dosage,
      voie_administration,
      quantite_disponible,
      unite_quantite,
      seuil_alerte,
      unite_seuil,
      date_expiration,
      fournisseur,
      observations,
    } = req.body;

    // ✅ Validation métier unique
    if (typeof nom_commercial !== "string" || nom_commercial.trim().length === 0) {
      return res.status(400).json({
        error: "⚠️ Le nom commercial est obligatoire.",
      });
    }

    const quantite = Number(quantite_disponible);
    const seuil = Number(seuil_alerte);

    let dateExp = null;
    if (date_expiration) {
      const parsed = new Date(date_expiration);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({
          error: "⚠️ Date d'expiration invalide.",
        });
      }
      dateExp = parsed;
    }

    const medicament = await Medicament.create({
      nom_commercial: nom_commercial.trim(),
      unite_nom_commercial: unite_nom_commercial?.trim() || null,
      nom_dci: nom_dci?.trim() || null,
      unite_nom_dci: unite_nom_dci?.trim() || null,
      forme: forme?.trim() || null,
      unite_forme: unite_forme?.trim() || null,
      dosage: dosage?.trim() || null,
      voie_administration: voie_administration?.trim() || null,
      quantite_disponible: isNaN(quantite) || quantite < 0 ? 0 : quantite,
      unite_quantite: unite_quantite?.trim() || null,
      seuil_alerte: isNaN(seuil) || seuil < 0 ? 10 : seuil,
      unite_seuil: unite_seuil?.trim() || null,
      date_expiration: dateExp,
      fournisseur: fournisseur?.trim() || null,
      observations: observations?.trim() || null,
    });

    majStatutDisponibilite(medicament);
    await medicament.save();

    return res.status(201).json({
      message: "✅ Médicament ajouté avec succès",
      medicament,
    });
  } catch (err) {
    console.error("❌ Erreur création médicament :", err);
    return res.status(500).json({
      error: "Erreur serveur lors de l'enregistrement",
      details: err.message,
    });
  }
};

/**
 * 📋 Liste de tous les médicaments
 */
exports.getAllMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.findAll();
    medicaments.forEach(majStatutDisponibilite);
    return res.json(medicaments);
  } catch (err) {
    console.error("❌ Erreur getAllMedicaments :", err);
    return res.status(500).json({
      error: "Erreur serveur lors du chargement",
      details: err.message,
    });
  }
};

/**
 * 🔍 Obtenir un médicament par ID
 */
exports.getMedicamentById = async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ error: "Médicament non trouvé ❌" });
    }

    majStatutDisponibilite(medicament);
    return res.json(medicament);
  } catch (err) {
    console.error("❌ Erreur getMedicamentById :", err);
    return res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

/**
 * ✏️ Mettre à jour un médicament
 */
exports.updateMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ error: "Médicament non trouvé ❌" });
    }

    const {
      nom_commercial,
      unite_nom_commercial,
      nom_dci,
      unite_nom_dci,
      forme,
      unite_forme,
      dosage,
      voie_administration,
      quantite_disponible,
      unite_quantite,
      seuil_alerte,
      unite_seuil,
      date_expiration,
      fournisseur,
      observations,
    } = req.body;

    if (nom_commercial !== undefined && nom_commercial.trim() === "") {
      return res.status(400).json({
        error: "⚠️ Le nom commercial ne peut pas être vide.",
      });
    }

    const quantite = Number(quantite_disponible);
    const seuil = Number(seuil_alerte);

    let dateExp = medicament.date_expiration;
    if (date_expiration !== undefined) {
      if (date_expiration === null || date_expiration === "") {
        dateExp = null;
      } else {
        const parsed = new Date(date_expiration);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({
            error: "⚠️ Date d'expiration invalide.",
          });
        }
        dateExp = parsed;
      }
    }

    await medicament.update({
      nom_commercial: nom_commercial?.trim() ?? medicament.nom_commercial,
      unite_nom_commercial: unite_nom_commercial?.trim() ?? medicament.unite_nom_commercial,
      nom_dci: nom_dci?.trim() ?? medicament.nom_dci,
      unite_nom_dci: unite_nom_dci?.trim() ?? medicament.unite_nom_dci,
      forme: forme?.trim() ?? medicament.forme,
      unite_forme: unite_forme?.trim() ?? medicament.unite_forme,
      dosage: dosage?.trim() ?? medicament.dosage,
      voie_administration: voie_administration?.trim() ?? medicament.voie_administration,
      quantite_disponible: isNaN(quantite) || quantite < 0 ? medicament.quantite_disponible : quantite,
      unite_quantite: unite_quantite?.trim() ?? medicament.unite_quantite,
      seuil_alerte: isNaN(seuil) || seuil < 0 ? medicament.seuil_alerte : seuil,
      unite_seuil: unite_seuil?.trim() ?? medicament.unite_seuil,
      date_expiration: dateExp,
      fournisseur: fournisseur?.trim() ?? medicament.fournisseur,
      observations: observations?.trim() ?? medicament.observations,
    });

    majStatutDisponibilite(medicament);
    await medicament.save();

    return res.json({
      message: "✅ Médicament mis à jour avec succès",
      medicament,
    });
  } catch (err) {
    console.error("❌ Erreur updateMedicament :", err);
    return res.status(500).json({
      error: "Erreur serveur lors de la mise à jour",
      details: err.message,
    });
  }
};

/**
 * ❌ Supprimer un médicament
 */
exports.deleteMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ error: "Médicament non trouvé ❌" });
    }

    await medicament.destroy();
    return res.json({ message: "✅ Médicament supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur deleteMedicament :", err);
    return res.status(500).json({
      error: "Erreur serveur lors de la suppression",
      details: err.message,
    });
  }
};

/**
 * 🚨 Médicaments en alerte ou rupture
 */
exports.alertesStock = async (req, res) => {
  try {
    const medicaments = await Medicament.findAll({
      where: {
        quantite_disponible: {
          [Op.lte]: Sequelize.col("seuil_alerte"),
        },
      },
    });

    medicaments.forEach(majStatutDisponibilite);
    return res.json(medicaments);
  } catch (err) {
    console.error("❌ Erreur alertesStock :", err);
    return res.status(500).json({
      error: "Erreur serveur lors du chargement des alertes",
      details: err.message,
    });
  }
};

/**
 * ♻️ Réapprovisionner un médicament
 */
exports.reapprovisionnerMedicament = async (req, res) => {
  try {
    const quantite = Number(req.body.quantite);
    if (isNaN(quantite) || quantite <= 0) {
      return res.status(400).json({ error: "⚠️ Quantité invalide." });
    }

    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ error: "Médicament non trouvé ❌" });
    }

    medicament.quantite_disponible += quantite;
    majStatutDisponibilite(medicament);
    await medicament.save();

    return res.json({
      message: "✅ Stock réapprovisionné avec succès",
      medicament,
    });
  } catch (err) {
    console.error("❌ Erreur reapprovisionnerMedicament :", err);
    return res.status(500).json({
      error: "Erreur serveur lors du réapprovisionnement",
      details: err.message,
    });
  }
};