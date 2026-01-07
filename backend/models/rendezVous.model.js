// backend/models/rendezVous.model.js
const { Model, DataTypes } = require("sequelize");

class RendezVous extends Model {
  static init(sequelize) {
    return super.init(
      {
        patient_id: { type: DataTypes.INTEGER, allowNull: false },
        medecin_id: { type: DataTypes.INTEGER, allowNull: false },
        date_rendez_vous: { type: DataTypes.DATE, allowNull: false },
        type_consultation: { type: DataTypes.STRING(100), allowNull: true },
        traitements_suivis: { type: DataTypes.JSON, allowNull: true },
        observations_medecin: { type: DataTypes.TEXT, allowNull: true },
        evolution_patient: { type: DataTypes.TEXT, allowNull: true },
      },
      {
        sequelize,
        modelName: "RendezVous",
        tableName: "rendez_vous",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Patient, { foreignKey: "patient_id", as: "patient" });
    this.belongsTo(models.Utilisateur, { foreignKey: "medecin_id", as: "medecin" });
  }
}

module.exports = RendezVous;
