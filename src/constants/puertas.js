const PUERTAS = {
  "Interior": {
    "Alto": [200],
    "Ancho": [60, 70, 80, 90],
    "Color": ["MDF", "Sabugueiro", "Cedrillo", "Cerejeira", "Caoba"],
    "Marco": ["Chapa 24", "Chapa 18", "Pino", "Cambara"],
    "Espesor": [3, 5.5, 9, 12],
    "Mano": ["Derecha", "Izquierda"],
    "Tabique": [10, 15],

    "Lineas": {
      "Clasica": {
        "modelos":{
          "Lisa": {
            "Espesor": [5.5, 9, 12],
            "Marco": {
              "Chapa 24": {
                "Espesor": [3]
              }
            }
          }
        } 
      },

      "2000": {
        "Enchapado": ["MDF"],
        "modelos": ["Florencia", "Veronica"],
        "Excepciones": {
          "SinChapa24": true,
          "SinEspesor3": true
        }
      },

      "2006": {
        "modelos": ["Americana", "Americana 2", "Mónica", "Sofia"],
        "Excepciones": {
          "SinChapa24": true,
          "SinEspesor3": true
        }
      },

      "Masonite": {
        "modelos": ["Avalon", "Candem", "Colonial"],
        "Espesor": [3],
        "Color": ["Blanco"]
      },

      "Elite": {
        "modelos": ["Blanco", "Ébano", "Teka", "Visón","Haya","Roble","Gris Carbono"],
        "Marcos": {
          "Chapa 18": {
            "Tabique": [10, 15],
            "Alto": [204, 218, 240]
          },
          "Pino": {
            "Tabique": [9, 14],
            "Alto": [204, 220, 240]
          }
        },
        "Espesor": [5.5],
        "Color": [
          "Ébano",
          "Blanco",
          "Teka",
          "Visón",
          "Haya",
          "Fresno",
          "Roble",
          "Gris carbono"
        ]
      }
    }
  },

  "Exterior": {
    "Lineas": {
      "Clásica": {
        "general": {
          "alto": [200],
          "ancho": [80],
          "color": ["Blanco", "Negro"]
        },
        "modelos": ["16 Curva","19 Florencia"]
        },      

      "Luján": {
        "general": {
          "alto": [200],
          "ancho": [80],
          "color": ["Blanco", "Gris Grafito"]
        },
        "modelos": ["24 Imperia","25 Verona","29 Florencia 1/2 Reja"]
      },

      "Pavir": {
        "general": {
          "color": ["Blanco Antártida", "Gris Grafito"]
        },
        "modelos": {
          "49 Lisa": {
            "alto": [200, 220],
            "ancho": {
              "200": [80, 90],
              "220": [90]
            }}
        }
      },

      "Pivotante": {
        "modelos": {
          "Álamo": {
            "alto": [220, 240],
            "ancho": [120],
            "color_hoja": ["Álamo"],
            "color_marco": ["Fresno"]
          },
          "Blanco": {
            "alto": [200, 220],
            "ancho": {
              "200": [100],
              "220": [120]
            },
            "color_hoja": ["Blanco"],
            "color_marco": ["Blanco"]
          }
        }
      },

      "Acero Simil": {
        "modelos": {
          "Lisa Entablonada": {
            "alto": [200, 220],
            "ancho": {
              "200": [80, 90],
              "220": [90]
            }
          },
          "49 Lisa Fresno": {
            "alto": [200],
            "ancho": [80, 90],
            "color": ["Fresno"]
          }
        }
      }
    }
  }
}



export { PUERTAS }