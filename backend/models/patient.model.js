const { Model, DataTypes, Sequelize } = require("sequelize");

class Patient extends Model {
  static init(sequelize) {
    return super.init(
      {
        nom: { type: DataTypes.STRING(100), allowNull: false },
        postnom: { type: DataTypes.STRING(100) },
        prenom: { type: DataTypes.STRING(100) },
        sexe: { type: DataTypes.STRING(10), allowNull: false },
        date_naissance: { type: DataTypes.DATEONLY, allowNull: false },
        adresse: { type: DataTypes.TEXT },
        numero_dossier: { type: DataTypes.STRING(50), unique: true },

        // ✅ Champs optionnels
        fonction: { type: DataTypes.STRING(100), allowNull: true },
        grade: { type: DataTypes.STRING(100), allowNull: true },
        matricule: { type: DataTypes.STRING(100), allowNull: true },
        unite: { type: DataTypes.STRING(100), allowNull: true },
        telephone: { type: DataTypes.STRING(20), allowNull: true },

        date_enregistrement: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW,},
      },
      {
        sequelize,
        modelName: "Patient",
        tableName: "patients",
        timestamps: false,
      }
    );
  }
}

module.exports = Patient;
