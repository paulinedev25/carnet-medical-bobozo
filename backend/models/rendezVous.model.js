<<<<<<< HEAD
// backend/models/rendezVous.model.js
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
const { Model, DataTypes } = require("sequelize");

class RendezVous extends Model {
  static init(sequelize) {
    return super.init(
      {
<<<<<<< HEAD
        patient_id: { type: DataTypes.INTEGER, allowNull: false },
        medecin_id: { type: DataTypes.INTEGER, allowNull: false },
        date_rendez_vous: { type: DataTypes.DATE, allowNull: false },
        type_consultation: { type: DataTypes.STRING(100), allowNull: true },
        traitements_suivis: { type: DataTypes.JSON, allowNull: true },
        observations_medecin: { type: DataTypes.TEXT, allowNull: true },
        evolution_patient: { type: DataTypes.TEXT, allowNull: true },
=======
        patient_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        medecin_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        date_rendez_vous: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        motif: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        observations: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
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
