// backend/models/soinInfirmier.model.js
const { Model, DataTypes } = require("sequelize");

class SoinInfirmier extends Model {
  static init(sequelize) {
    return super.init(
      {
        hospitalisation_id: { type: DataTypes.INTEGER, allowNull: true },
        consultation_id: { type: DataTypes.INTEGER, allowNull: true },
        infirmier_id: { type: DataTypes.INTEGER, allowNull: false },
        medecin_id: { type: DataTypes.INTEGER, allowNull: true },

        // Détails du soin
        type_soin: { type: DataTypes.STRING(255), allowNull: false },
        date_soin: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        observations: { type: DataTypes.TEXT, allowNull: true },

        // Enrichissements
        type_traitement: { type: DataTypes.STRING(255), allowNull: true },
        dose: { type: DataTypes.STRING(50), allowNull: true },
        frequence: { type: DataTypes.STRING(50), allowNull: true },
        parametres_vitaux: { type: DataTypes.JSON, allowNull: true },
        evolution_etat: { type: DataTypes.TEXT, allowNull: true },
        activites: { type: DataTypes.JSON, allowNull: true },

        // Workflow
        statut_validation: { type: DataTypes.ENUM("en_attente", "valide", "rejete"), allowNull: false, defaultValue: "en_attente" },
        remarque_medecin: { type: DataTypes.TEXT, allowNull: true },
      },
      {
        sequelize,
        modelName: "SoinInfirmier",
        tableName: "soins_infirmiers",
        timestamps: false,
        indexes: [
          { fields: ["hospitalisation_id"] },
          { fields: ["consultation_id"] },
          { fields: ["infirmier_id"] },
          { fields: ["medecin_id"] },
          { fields: ["statut_validation"] },
          { fields: ["date_soin"] },
        ],
        validate: {
          auMoinsUnContexte() {
            if (!this.hospitalisation_id && !this.consultation_id) {
              throw new Error("Un soin doit être lié à une hospitalisation ou consultation");
            }
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Hospitalisation, { foreignKey: "hospitalisation_id", as: "hospitalisation" });
    this.belongsTo(models.Consultation, { foreignKey: "consultation_id", as: "consultation" });
    this.belongsTo(models.Utilisateur, { foreignKey: "infirmier_id", as: "infirmier" });
    this.belongsTo(models.Utilisateur, { foreignKey: "medecin_id", as: "medecin" });
  }
}

module.exports = SoinInfirmier;
