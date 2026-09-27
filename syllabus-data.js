// Comprehensive Curriculum & Chapter Catalog for JEE, NEET, and Class 12 Boards

const SYLLABUS_DATA = {
  jee: {
    name: "JEE (Main & Advanced)",
    target: "IIT JEE",
    subjects: [
      {
        id: "physics",
        name: "Physics",
        color: "#9A3412", // Burnt Orange / Terracotta
        chapters: [
          // Class 11
          { id: "p11_01", title: "Units and Measurements", class: "11", weightage: "2%" },
          { id: "p11_02", title: "Motion in a Straight Line", class: "11", weightage: "3%" },
          { id: "p11_03", title: "Motion in a Plane (Vectors & Projectile)", class: "11", weightage: "4%" },
          { id: "p11_04", title: "Laws of Motion & Friction", class: "11", weightage: "5%" },
          { id: "p11_05", title: "Work, Energy and Power", class: "11", weightage: "5%" },
          { id: "p11_06", title: "System of Particles & Rotational Motion", class: "11", weightage: "8%" },
          { id: "p11_07", title: "Gravitation", class: "11", weightage: "4%" },
          { id: "p11_08", title: "Mechanical Properties of Solids", class: "11", weightage: "2%" },
          { id: "p11_09", title: "Mechanical Properties of Fluids", class: "11", weightage: "4%" },
          { id: "p11_10", title: "Thermal Properties of Matter", class: "11", weightage: "3%" },
          { id: "p11_11", title: "Thermodynamics & KTG", class: "11", weightage: "7%" },
          { id: "p11_12", title: "Oscillations (SHM)", class: "11", weightage: "5%" },
          { id: "p11_13", title: "Waves and Sound", class: "11", weightage: "4%" },
          // Class 12
          { id: "p12_01", title: "Electric Charges and Fields", class: "12", weightage: "4%" },
          { id: "p12_02", title: "Electrostatic Potential & Capacitance", class: "12", weightage: "6%" },
          { id: "p12_03", title: "Current Electricity", class: "12", weightage: "7%" },
          { id: "p12_04", title: "Moving Charges & Magnetism", class: "12", weightage: "6%" },
          { id: "p12_05", title: "Magnetism and Matter", class: "12", weightage: "2%" },
          { id: "p12_06", title: "Electromagnetic Induction (EMI)", class: "12", weightage: "5%" },
          { id: "p12_07", title: "Alternating Current (AC)", class: "12", weightage: "4%" },
          { id: "p12_08", title: "Electromagnetic Waves", class: "12", weightage: "2%" },
          { id: "p12_09", title: "Ray Optics and Optical Instruments", class: "12", weightage: "6%" },
          { id: "p12_10", title: "Wave Optics", class: "12", weightage: "4%" },
          { id: "p12_11", title: "Dual Nature of Radiation & Matter", class: "12", weightage: "3%" },
          { id: "p12_12", title: "Atoms & Nuclei", class: "12", weightage: "5%" },
          { id: "p12_13", title: "Semiconductor Electronics", class: "12", weightage: "6%" }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        color: "#1E3A8A", // Deep Navy / Royal
        chapters: [
          // Class 11
          { id: "c11_01", title: "Some Basic Concepts of Chemistry (Mole)", class: "11", weightage: "4%" },
          { id: "c11_02", title: "Structure of Atom", class: "11", weightage: "5%" },
          { id: "c11_03", title: "Periodic Table & Periodicity", class: "11", weightage: "4%" },
          { id: "c11_04", title: "Chemical Bonding & Molecular Structure", class: "11", weightage: "8%" },
          { id: "c11_05", title: "Chemical Thermodynamics", class: "11", weightage: "7%" },
          { id: "c11_06", title: "Equilibrium (Chemical & Ionic)", class: "11", weightage: "7%" },
          { id: "c11_07", title: "Redox Reactions", class: "11", weightage: "3%" },
          { id: "c11_08", title: "General Organic Chemistry (GOC)", class: "11", weightage: "8%" },
          { id: "c11_09", title: "Hydrocarbons", class: "11", weightage: "5%" },
          // Class 12
          { id: "c12_01", title: "Solutions & Colligative Properties", class: "12", weightage: "5%" },
          { id: "c12_02", title: "Electrochemistry", class: "12", weightage: "6%" },
          { id: "c12_03", title: "Chemical Kinetics", class: "12", weightage: "5%" },
          { id: "c12_04", title: "d and f Block Elements", class: "12", weightage: "4%" },
          { id: "c12_05", title: "Coordination Compounds", class: "12", weightage: "7%" },
          { id: "c12_06", title: "Haloalkanes and Haloarenes", class: "12", weightage: "4%" },
          { id: "c12_07", title: "Alcohols, Phenols and Ethers", class: "12", weightage: "5%" },
          { id: "c12_08", title: "Aldehydes, Ketones & Carboxylic Acids", class: "12", weightage: "7%" },
          { id: "c12_09", title: "Amines & Organic Nitrogen Compounds", class: "12", weightage: "4%" },
          { id: "c12_10", title: "Biomolecules", class: "12", weightage: "3%" }
        ]
      },
      {
        id: "mathematics",
        name: "Mathematics",
        color: "#831843", // Deep Wine / Burgundy
        chapters: [
          // Class 11
          { id: "m11_01", title: "Sets, Relations and Functions", class: "11", weightage: "5%" },
          { id: "m11_02", title: "Trigonometric Functions & Equations", class: "11", weightage: "4%" },
          { id: "m11_03", title: "Complex Numbers & Quadratic Equations", class: "11", weightage: "6%" },
          { id: "m11_04", title: "Permutations and Combinations", class: "11", weightage: "5%" },
          { id: "m11_05", title: "Binomial Theorem", class: "11", weightage: "4%" },
          { id: "m11_06", title: "Sequences and Series", class: "11", weightage: "5%" },
          { id: "m11_07", title: "Straight Lines", class: "11", weightage: "4%" },
          { id: "m11_08", title: "Conic Sections (Circles, Parabola, Ellipse, Hyperbola)", class: "11", weightage: "8%" },
          // Class 12
          { id: "m12_01", title: "Matrices and Determinants", class: "12", weightage: "7%" },
          { id: "m12_02", title: "Limits, Continuity and Differentiability", class: "12", weightage: "6%" },
          { id: "m12_03", title: "Application of Derivatives (AOD)", class: "12", weightage: "6%" },
          { id: "m12_04", title: "Indefinite & Definite Integrals", class: "12", weightage: "9%" },
          { id: "m12_05", title: "Differential Equations", class: "12", weightage: "5%" },
          { id: "m12_06", title: "Vector Algebra", class: "12", weightage: "6%" },
          { id: "m12_07", title: "Three Dimensional Geometry (3D)", class: "12", weightage: "8%" },
          { id: "m12_08", title: "Probability & Statistics", class: "12", weightage: "6%" }
        ]
      }
    ]
  },
  neet: {
    name: "NEET (UG Medical)",
    target: "NEET UG",
    subjects: [
      {
        id: "physics",
        name: "Physics",
        color: "#9A3412",
        chapters: [
          { id: "np_01", title: "Physical World & Measurement", class: "11", weightage: "3%" },
          { id: "np_02", title: "Kinematics", class: "11", weightage: "5%" },
          { id: "np_03", title: "Laws of Motion", class: "11", weightage: "6%" },
          { id: "np_04", title: "Work, Energy & Power", class: "11", weightage: "5%" },
          { id: "np_05", title: "Rotational Motion", class: "11", weightage: "6%" },
          { id: "np_06", title: "Gravitation", class: "11", weightage: "4%" },
          { id: "np_07", title: "Properties of Bulk Matter", class: "11", weightage: "5%" },
          { id: "np_08", title: "Thermodynamics & KTG", class: "11", weightage: "8%" },
          { id: "np_09", title: "Oscillations & Waves", class: "11", weightage: "6%" },
          { id: "np_10", title: "Electrostatics & Capacitors", class: "12", weightage: "8%" },
          { id: "np_11", title: "Current Electricity", class: "12", weightage: "8%" },
          { id: "np_12", title: "Magnetic Effects of Current & Magnetism", class: "12", weightage: "7%" },
          { id: "np_13", title: "EMI & Alternating Current", class: "12", weightage: "6%" },
          { id: "np_14", title: "Optics (Ray & Wave)", class: "12", weightage: "9%" },
          { id: "np_15", title: "Modern Physics (Dual Nature, Atoms, Nuclei)", class: "12", weightage: "9%" },
          { id: "np_16", title: "Electronic Devices (Semiconductors)", class: "12", weightage: "5%" }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        color: "#1E3A8A",
        chapters: [
          { id: "nc_01", title: "Basic Concepts of Chemistry (Mole)", class: "11", weightage: "4%" },
          { id: "nc_02", title: "Structure of Atom", class: "11", weightage: "4%" },
          { id: "nc_03", title: "Periodic Table & Periodicity", class: "11", weightage: "4%" },
          { id: "nc_04", title: "Chemical Bonding & Molecular Structure", class: "11", weightage: "8%" },
          { id: "nc_05", title: "Chemical Thermodynamics", class: "11", weightage: "6%" },
          { id: "nc_06", title: "Equilibrium (Ionic & Chemical)", class: "11", weightage: "6%" },
          { id: "nc_07", title: "Redox Reactions", class: "11", weightage: "3%" },
          { id: "nc_08", title: "Hydrocarbons & GOC", class: "11", weightage: "10%" },
          { id: "nc_09", title: "Solutions", class: "12", weightage: "5%" },
          { id: "nc_10", title: "Electrochemistry", class: "12", weightage: "5%" },
          { id: "nc_11", title: "Chemical Kinetics", class: "12", weightage: "5%" },
          { id: "nc_12", title: "d and f Block Elements", class: "12", weightage: "4%" },
          { id: "nc_13", title: "Coordination Compounds", class: "12", weightage: "6%" },
          { id: "nc_14", title: "Haloalkanes & Haloarenes", class: "12", weightage: "4%" },
          { id: "nc_15", title: "Alcohols, Phenols and Ethers", class: "12", weightage: "5%" },
          { id: "nc_16", title: "Aldehydes, Ketones & Carboxylic Acids", class: "12", weightage: "7%" },
          { id: "nc_17", title: "Organic Nitrogen Compounds (Amines)", class: "12", weightage: "4%" },
          { id: "nc_18", title: "Biomolecules", class: "12", weightage: "4%" }
        ]
      },
      {
        id: "biology",
        name: "Biology",
        color: "#065F46", // Deep Emerald
        chapters: [
          // Class 11
          { id: "nb_01", title: "The Living World & Biological Classification", class: "11", weightage: "5%" },
          { id: "nb_02", title: "Plant Kingdom", class: "11", weightage: "5%" },
          { id: "nb_03", title: "Animal Kingdom", class: "11", weightage: "6%" },
          { id: "nb_04", title: "Morphology & Anatomy of Flowering Plants", class: "11", weightage: "7%" },
          { id: "nb_05", title: "Structural Organisation in Animals", class: "11", weightage: "3%" },
          { id: "nb_06", title: "Cell: The Unit of Life & Cell Cycle", class: "11", weightage: "10%" },
          { id: "nb_07", title: "Plant Physiology (Photosynthesis & Respiration)", class: "11", weightage: "8%" },
          { id: "nb_08", title: "Human Physiology (Digestion, Breathing, Circulation)", class: "11", weightage: "12%" },
          { id: "nb_09", title: "Human Physiology (Excretion, Locomotion, Neural, Chemical)", class: "11", weightage: "10%" },
          // Class 12
          { id: "nb_10", title: "Sexual Reproduction in Flowering Plants", class: "12", weightage: "7%" },
          { id: "nb_11", title: "Human Reproduction & Reproductive Health", class: "12", weightage: "8%" },
          { id: "nb_12", title: "Principles of Inheritance and Variation (Genetics)", class: "12", weightage: "10%" },
          { id: "nb_13", title: "Molecular Basis of Inheritance (DNA/RNA)", class: "12", weightage: "11%" },
          { id: "nb_14", title: "Evolution", class: "12", weightage: "4%" },
          { id: "nb_15", title: "Human Health and Diseases", class: "12", weightage: "6%" },
          { id: "nb_16", title: "Biotechnology: Principles and Processes", class: "12", weightage: "7%" },
          { id: "nb_17", title: "Biotechnology and its Applications", class: "12", weightage: "5%" },
          { id: "nb_18", title: "Ecology and Environment", class: "12", weightage: "10%" }
        ]
      }
    ]
  },
  cbse12: {
    name: "Class 12 Boards (Science)",
    target: "CBSE Board 12th",
    subjects: [
      {
        id: "physics",
        name: "Physics (Class 12)",
        color: "#9A3412",
        chapters: [
          { id: "bp_01", title: "Electric Charges and Fields", class: "12", weightage: "7 marks" },
          { id: "bp_02", title: "Electrostatic Potential and Capacitance", class: "12", weightage: "9 marks" },
          { id: "bp_03", title: "Current Electricity", class: "12", weightage: "7 marks" },
          { id: "bp_04", title: "Moving Charges and Magnetism", class: "12", weightage: "8 marks" },
          { id: "bp_05", title: "Magnetism and Matter", class: "12", weightage: "3 marks" },
          { id: "bp_06", title: "Electromagnetic Induction", class: "12", weightage: "4 marks" },
          { id: "bp_07", title: "Alternating Current", class: "12", weightage: "5 marks" },
          { id: "bp_08", title: "Electromagnetic Waves", class: "12", weightage: "3 marks" },
          { id: "bp_09", title: "Ray Optics and Optical Instruments", class: "12", weightage: "10 marks" },
          { id: "bp_10", title: "Wave Optics", class: "12", weightage: "8 marks" },
          { id: "bp_11", title: "Dual Nature of Radiation and Matter", class: "12", weightage: "4 marks" },
          { id: "bp_12", title: "Atoms and Nuclei", class: "12", weightage: "7 marks" },
          { id: "bp_13", title: "Semiconductor Devices", class: "12", weightage: "7 marks" }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry (Class 12)",
        color: "#1E3A8A",
        chapters: [
          { id: "bc_01", title: "Solutions", class: "12", weightage: "7 marks" },
          { id: "bc_02", title: "Electrochemistry", class: "12", weightage: "9 marks" },
          { id: "bc_03", title: "Chemical Kinetics", class: "12", weightage: "7 marks" },
          { id: "bc_04", title: "d- and f-Block Elements", class: "12", weightage: "7 marks" },
          { id: "bc_05", title: "Coordination Compounds", class: "12", weightage: "7 marks" },
          { id: "bc_06", title: "Haloalkanes and Haloarenes", class: "12", weightage: "6 marks" },
          { id: "bc_07", title: "Alcohols, Phenols and Ethers", class: "12", weightage: "6 marks" },
          { id: "bc_08", title: "Aldehydes, Ketones and Carboxylic Acids", class: "12", weightage: "8 marks" },
          { id: "bc_09", title: "Amines", class: "12", weightage: "6 marks" },
          { id: "bc_10", title: "Biomolecules", class: "12", weightage: "7 marks" }
        ]
      },
      {
        id: "mathematics",
        name: "Mathematics (Class 12)",
        color: "#831843",
        chapters: [
          { id: "bm_01", title: "Relations and Functions", class: "12", weightage: "8 marks" },
          { id: "bm_02", title: "Inverse Trigonometric Functions", class: "12", weightage: "4 marks" },
          { id: "bm_03", title: "Matrices and Determinants", class: "12", weightage: "10 marks" },
          { id: "bm_04", title: "Continuity and Differentiability", class: "12", weightage: "9 marks" },
          { id: "bm_05", title: "Application of Derivatives", class: "12", weightage: "8 marks" },
          { id: "bm_06", title: "Integrals (Definite & Indefinite)", class: "12", weightage: "12 marks" },
          { id: "bm_07", title: "Applications of the Integrals", class: "12", weightage: "6 marks" },
          { id: "bm_08", title: "Differential Equations", class: "12", weightage: "7 marks" },
          { id: "bm_09", title: "Vectors & Three-Dimensional Geometry", class: "12", weightage: "14 marks" },
          { id: "bm_10", title: "Linear Programming", class: "12", weightage: "5 marks" },
          { id: "bm_11", title: "Probability", class: "12", weightage: "8 marks" }
        ]
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.SYLLABUS_DATA = SYLLABUS_DATA;
}
