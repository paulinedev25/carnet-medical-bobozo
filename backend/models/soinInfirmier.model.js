const { Model, DataTypes } = require("sequelize");

class SoinInfirmier extends Model {
  static init(sequelize) {
    return super.init(
      {
        // 🔗 Liens contexte patient
        hospitalisation_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        consultation_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        // 👩‍⚕️ Infirmier responsable
        infirmier_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        // 🩺 Médecin validateur
        medecin_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        // 🧪 Détails du soin
        type_soin: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },

        date_soin: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },

        observations: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        // 🔁 Workflow validation
        statut_validation: {
          type: DataTypes.ENUM("en_attente", "valide", "rejete"),
          allowNull: false,
          defaultValue: "en_attente",
        },

        remarque_medecin: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "SoinInfirmier",
        tableName: "soins_infirmiers",

        // 🕒 Historique → Désactivé pour éviter created_at / updated_at
        timestamps: false, 

        // ⚡ Performances
        indexes: [
          { fields: ["hospitalisation_id"] },
          { fields: ["consultation_id"] },
          { fields: ["infirmier_id"] },
          { fields: ["medecin_id"] },
          { fields: ["statut_validation"] },
          { fields: ["date_soin"] },
        ],

        // 🛡️ Validation métier
        validate: {
          auMoinsUnContexte() {
            if (!this.hospitalisation_id && !this.consultation_id) {
              throw new Error(
                "Un soin doit être lié soit à une hospitalisation soit à une consultation"
              );
            }
          },
        },
      }
    );
  }

  static associate(models) {
    // 🏥 Hospitalisation
    this.belongsTo(models.Hospitalisation, {
      foreignKey: "hospitalisation_id",
      as: "hospitalisation",
    });

    // 🏠 Consultation ambulatoire
    this.belongsTo(models.Consultation, {
      foreignKey: "consultation_id",
      as: "consultation",
    });

    // 👩‍⚕️ Infirmier
    this.belongsTo(models.Utilisateur, {
      foreignKey: "infirmier_id",
      as: "infirmier",
    });

    // 🧑‍⚕️ Médecin validateur
    this.belongsTo(models.Utilisateur, {
      foreignKey: "medecin_id",
      as: "medecin",
    });
  }
}

module.exports = SoinInfirmier;
