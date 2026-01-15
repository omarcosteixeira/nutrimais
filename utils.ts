
import { PatientData, CalculatedResults, Gender, Food, NutrientInfo, LabResult, FoodEntry } from './types';

// Expanded Database based on TACO (4ª Edição) & IBGE Tables
export const FOOD_DATABASE: Food[] = [
  // --- GRUPO 1: CEREAIS, PÃES E TUBÉRCULOS ---
  { 
    id: 'taco_1', group: 'Cereais', name: 'Arroz, tipo 1, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa cheia', householdWeight: 25, 
    nutrients: { calories: 128, protein: 2.5, lipids: 0.2, carbs: 28.1, fiber: 1.6, calcium: 4, iron: 0.1, magnesium: 2, zinc: 0.4 } 
  },
  { 
    id: 'taco_2', group: 'Cereais', name: 'Arroz, integral, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa cheia', householdWeight: 25, 
    nutrients: { calories: 124, protein: 2.6, lipids: 1.0, carbs: 25.8, fiber: 2.7, calcium: 5, iron: 0.3, magnesium: 59, zinc: 0.7 } 
  },
  { 
    id: 'taco_3', group: 'Cereais', name: 'Aveia, flocos, crua', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 18, 
    nutrients: { calories: 394, protein: 13.9, lipids: 8.5, carbs: 66.6, fiber: 9.1, calcium: 48, iron: 4.5, magnesium: 119, zinc: 2.6 } 
  },
  { 
    id: 'taco_4', group: 'Cereais', name: 'Milho, verde, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 24, 
    nutrients: { calories: 138, protein: 6.6, lipids: 0.6, carbs: 28.6, fiber: 4.6, calcium: 2, iron: 0.1, magnesium: 23, zinc: 0.4 } 
  },
  { 
    id: 'taco_5', group: 'Pães', name: 'Pão, trigo, francês', baseUnit: '100g', 
    householdUnit: 'unidade', householdWeight: 50, 
    nutrients: { calories: 300, protein: 8.0, lipids: 3.1, carbs: 58.6, fiber: 2.3, calcium: 16, iron: 1.0, magnesium: 27, zinc: 0.8 } 
  },
  { 
    id: 'taco_6', group: 'Pães', name: 'Pão, trigo, forma, integral', baseUnit: '100g', 
    householdUnit: 'fatia', householdWeight: 25, 
    nutrients: { calories: 253, protein: 9.4, lipids: 3.7, carbs: 49.9, fiber: 6.9, calcium: 132, iron: 2.7, magnesium: 60, zinc: 1.6 } 
  },
  { 
    id: 'taco_7', group: 'Massas', name: 'Macarrão, trigo, cozido', baseUnit: '100g', 
    householdUnit: 'escumadeira', householdWeight: 80, 
    nutrients: { calories: 157, protein: 5.8, lipids: 0.9, carbs: 30.7, fiber: 1.8, calcium: 8, iron: 0.6, magnesium: 16, zinc: 0.5 } 
  },
  { 
    id: 'taco_8', group: 'Tubérculos', name: 'Batata, inglesa, cozida', baseUnit: '100g', 
    householdUnit: 'colher de sopa picada', householdWeight: 30, 
    nutrients: { calories: 52, protein: 1.2, lipids: 0, carbs: 11.9, fiber: 1.3, calcium: 5, iron: 0.4, magnesium: 15, zinc: 0.2 } 
  },
  { 
    id: 'taco_9', group: 'Tubérculos', name: 'Batata, doce, cozida', baseUnit: '100g', 
    householdUnit: 'fatia média', householdWeight: 40, 
    nutrients: { calories: 77, protein: 0.6, lipids: 0.1, carbs: 18.4, fiber: 2.2, calcium: 17, iron: 0.2, magnesium: 11, zinc: 0.1 } 
  },
  { 
    id: 'taco_10', group: 'Tubérculos', name: 'Mandioca, cozida', baseUnit: '100g', 
    householdUnit: 'pedaço médio', householdWeight: 50, 
    nutrients: { calories: 125, protein: 0.6, lipids: 0.3, carbs: 30.1, fiber: 1.6, calcium: 19, iron: 0.2, magnesium: 13, zinc: 0.2 } 
  },
  { 
    id: 'taco_11', group: 'Cereais', name: 'Cuscuz de milho, cozido', baseUnit: '100g', 
    householdUnit: 'fatia média', householdWeight: 80, 
    nutrients: { calories: 113, protein: 2.2, lipids: 0.7, carbs: 25.3, fiber: 2.1, calcium: 1, iron: 0.3, magnesium: 12, zinc: 0.3 } 
  },
  { 
    id: 'taco_12', group: 'Cereais', name: 'Tapioca, goma, hidratada', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 20, 
    nutrients: { calories: 242, protein: 0.1, lipids: 0, carbs: 60, fiber: 0, calcium: 2, iron: 0.1, magnesium: 1, zinc: 0 } 
  },

  // --- GRUPO 2: LEGUMINOSAS ---
  { 
    id: 'taco_13', group: 'Leguminosas', name: 'Feijão, carioca, cozido', baseUnit: '100g', 
    householdUnit: 'concha média', householdWeight: 140, 
    nutrients: { calories: 76, protein: 4.8, lipids: 0.5, carbs: 13.6, fiber: 8.5, calcium: 27, iron: 1.3, magnesium: 42, zinc: 0.7 } 
  },
  { 
    id: 'taco_14', group: 'Leguminosas', name: 'Feijão, preto, cozido', baseUnit: '100g', 
    householdUnit: 'concha média', householdWeight: 140, 
    nutrients: { calories: 77, protein: 4.5, lipids: 0.5, carbs: 14, fiber: 8.4, calcium: 29, iron: 1.5, magnesium: 40, zinc: 0.7 } 
  },
  { 
    id: 'taco_15', group: 'Leguminosas', name: 'Grão-de-bico, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 25, 
    nutrients: { calories: 164, protein: 8.9, lipids: 2.6, carbs: 27.4, fiber: 7.6, calcium: 49, iron: 2.9, magnesium: 48, zinc: 1.5 } 
  },
  { 
    id: 'taco_16', group: 'Leguminosas', name: 'Lentilha, cozida', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 25, 
    nutrients: { calories: 116, protein: 9.0, lipids: 0.4, carbs: 20.1, fiber: 7.9, calcium: 19, iron: 3.3, magnesium: 36, zinc: 1.3 } 
  },
  { 
    id: 'taco_17', group: 'Leguminosas', name: 'Soja, cozida', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 25, 
    nutrients: { calories: 173, protein: 16.7, lipids: 9.9, carbs: 9.9, fiber: 6.1, calcium: 102, iron: 5.1, magnesium: 86, zinc: 1.2 } 
  },

  // --- GRUPO 3: HORTALIÇAS E VERDURAS ---
  { 
    id: 'taco_18', group: 'Hortaliças', name: 'Alface, americana, crua', baseUnit: '100g', 
    householdUnit: 'folha média', householdWeight: 15, 
    nutrients: { calories: 9, protein: 0.6, lipids: 0.1, carbs: 1.7, fiber: 1.0, calcium: 14, iron: 0.3, magnesium: 6, zinc: 0.1 } 
  },
  { 
    id: 'taco_19', group: 'Hortaliças', name: 'Rúcula, crua', baseUnit: '100g', 
    householdUnit: 'pires de chá', householdWeight: 30, 
    nutrients: { calories: 13, protein: 1.8, lipids: 0.1, carbs: 2.2, fiber: 1.7, calcium: 117, iron: 1.2, magnesium: 18, zinc: 0.2 } 
  },
  { 
    id: 'taco_20', group: 'Hortaliças', name: 'Brócolis, cozido', baseUnit: '100g', 
    householdUnit: 'ramo médio', householdWeight: 30, 
    nutrients: { calories: 25, protein: 2.1, lipids: 0.5, carbs: 4.4, fiber: 3.4, calcium: 51, iron: 0.6, magnesium: 15, zinc: 0.3 } 
  },
  { 
    id: 'taco_21', group: 'Hortaliças', name: 'Cenoura, crua', baseUnit: '100g', 
    householdUnit: 'unidade média', householdWeight: 70, 
    nutrients: { calories: 34, protein: 1.3, lipids: 0.2, carbs: 7.7, fiber: 3.2, calcium: 23, iron: 0.2, magnesium: 11, zinc: 0.2 } 
  },
  { 
    id: 'taco_22', group: 'Hortaliças', name: 'Cenoura, cozida', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 25, 
    nutrients: { calories: 30, protein: 0.8, lipids: 0.2, carbs: 6.7, fiber: 2.6, calcium: 26, iron: 0.2, magnesium: 13, zinc: 0.2 } 
  },
  { 
    id: 'taco_23', group: 'Hortaliças', name: 'Beterraba, cozida', baseUnit: '100g', 
    householdUnit: 'fatia média', householdWeight: 30, 
    nutrients: { calories: 32, protein: 1.3, lipids: 0.1, carbs: 7.2, fiber: 1.9, calcium: 15, iron: 0.2, magnesium: 17, zinc: 0.3 } 
  },
  { 
    id: 'taco_24', group: 'Hortaliças', name: 'Abóbora, cabotian, cozida', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 30, 
    nutrients: { calories: 48, protein: 1.4, lipids: 0.7, carbs: 10.8, fiber: 2.5, calcium: 9, iron: 0.2, magnesium: 6, zinc: 0.2 } 
  },
  { 
    id: 'taco_25', group: 'Hortaliças', name: 'Tomate, salada, cru', baseUnit: '100g', 
    householdUnit: 'fatia', householdWeight: 20, 
    nutrients: { calories: 15, protein: 1.1, lipids: 0.2, carbs: 3.1, fiber: 1.2, calcium: 7, iron: 0.2, magnesium: 10, zinc: 0.1 } 
  },
  { 
    id: 'taco_26', group: 'Hortaliças', name: 'Espinafre, refogado', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 25, 
    nutrients: { calories: 67, protein: 2.7, lipids: 5.8, carbs: 4.2, fiber: 2.5, calcium: 112, iron: 1.8, magnesium: 63, zinc: 0.5 } 
  },

  // --- GRUPO 4: FRUTAS ---
  { 
    id: 'taco_27', group: 'Frutas', name: 'Banana, prata, crua', baseUnit: '100g', 
    householdUnit: 'unidade média', householdWeight: 70, 
    nutrients: { calories: 98, protein: 1.3, lipids: 0.1, carbs: 26.0, fiber: 2.0, calcium: 8, iron: 0.4, magnesium: 28, zinc: 0.2 } 
  },
  { 
    id: 'taco_28', group: 'Frutas', name: 'Maçã, fuji, com casca', baseUnit: '100g', 
    householdUnit: 'unidade média', householdWeight: 130, 
    nutrients: { calories: 56, protein: 0.3, lipids: 0, carbs: 15.2, fiber: 1.3, calcium: 3, iron: 0.1, magnesium: 5, zinc: 0 } 
  },
  { 
    id: 'taco_29', group: 'Frutas', name: 'Laranja, pera, crua', baseUnit: '100g', 
    householdUnit: 'unidade média', householdWeight: 140, 
    nutrients: { calories: 37, protein: 1.0, lipids: 0.1, carbs: 8.9, fiber: 0.8, calcium: 31, iron: 0.1, magnesium: 11, zinc: 0.1 } 
  },
  { 
    id: 'taco_30', group: 'Frutas', name: 'Mamão, papaya, cru', baseUnit: '100g', 
    householdUnit: 'metade peq.', householdWeight: 140, 
    nutrients: { calories: 40, protein: 0.5, lipids: 0.1, carbs: 10.4, fiber: 1.0, calcium: 22, iron: 0.2, magnesium: 22, zinc: 0.1 } 
  },
  { 
    id: 'taco_31', group: 'Frutas', name: 'Abacaxi, pérola, cru', baseUnit: '100g', 
    householdUnit: 'fatia', householdWeight: 80, 
    nutrients: { calories: 48, protein: 0.9, lipids: 0.1, carbs: 12.3, fiber: 1.0, calcium: 22, iron: 0.3, magnesium: 18, zinc: 0.1 } 
  },
  { 
    id: 'taco_32', group: 'Frutas', name: 'Melancia, crua', baseUnit: '100g', 
    householdUnit: 'fatia média', householdWeight: 200, 
    nutrients: { calories: 33, protein: 0.9, lipids: 0, carbs: 8.1, fiber: 0.1, calcium: 8, iron: 0.2, magnesium: 9, zinc: 0.1 } 
  },
  { 
    id: 'taco_33', group: 'Frutas', name: 'Abacate, cru', baseUnit: '100g', 
    householdUnit: 'colher de sopa cheia', householdWeight: 35, 
    nutrients: { calories: 96, protein: 1.2, lipids: 8.4, carbs: 6.0, fiber: 6.3, calcium: 8, iron: 0.2, magnesium: 15, zinc: 0.2 } 
  },
  { 
    id: 'taco_34', group: 'Frutas', name: 'Manga, palmer, crua', baseUnit: '100g', 
    householdUnit: 'metade', householdWeight: 150, 
    nutrients: { calories: 72, protein: 0.4, lipids: 0.2, carbs: 19.4, fiber: 1.6, calcium: 8, iron: 0.1, magnesium: 11, zinc: 0.1 } 
  },

  // --- GRUPO 5: CARNES E OVOS ---
  { 
    id: 'taco_35', group: 'Carnes', name: 'Frango, peito, sem pele, grelhado', baseUnit: '100g', 
    householdUnit: 'filé médio', householdWeight: 100, 
    nutrients: { calories: 159, protein: 32.0, lipids: 2.5, carbs: 0, fiber: 0, calcium: 11, iron: 0.4, magnesium: 28, zinc: 0.8 } 
  },
  { 
    id: 'taco_36', group: 'Carnes', name: 'Frango, peito, sem pele, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa (desfiado)', householdWeight: 25, 
    nutrients: { calories: 163, protein: 31.5, lipids: 3.2, carbs: 0, fiber: 0, calcium: 9, iron: 0.4, magnesium: 26, zinc: 0.8 } 
  },
  { 
    id: 'taco_37', group: 'Carnes', name: 'Carne bovina, patinho, sem gordura, grelhado', baseUnit: '100g', 
    householdUnit: 'bife médio', householdWeight: 100, 
    nutrients: { calories: 219, protein: 35.9, lipids: 7.3, carbs: 0, fiber: 0, calcium: 5, iron: 2.8, magnesium: 26, zinc: 6.7 } 
  },
  { 
    id: 'taco_38', group: 'Carnes', name: 'Carne bovina, acém, moído, cozido', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 30, 
    nutrients: { calories: 212, protein: 26.7, lipids: 10.9, carbs: 0, fiber: 0, calcium: 12, iron: 2.4, magnesium: 22, zinc: 5.6 } 
  },
  { 
    id: 'taco_39', group: 'Carnes', name: 'Carne bovina, contra-filé, sem gordura, grelhado', baseUnit: '100g', 
    householdUnit: 'bife grande', householdWeight: 120, 
    nutrients: { calories: 194, protein: 32.4, lipids: 6.0, carbs: 0, fiber: 0, calcium: 4, iron: 2.2, magnesium: 21, zinc: 4.8 } 
  },
  { 
    id: 'taco_40', group: 'Pescados', name: 'Peixe, tilápia, filé, grelhado', baseUnit: '100g', 
    householdUnit: 'filé médio', householdWeight: 100, 
    nutrients: { calories: 128, protein: 26.2, lipids: 2.7, carbs: 0, fiber: 0, calcium: 10, iron: 0.3, magnesium: 27, zinc: 0.5 } 
  },
  { 
    id: 'taco_41', group: 'Pescados', name: 'Peixe, salmão, sem pele, grelhado', baseUnit: '100g', 
    householdUnit: 'filé médio', householdWeight: 100, 
    nutrients: { calories: 229, protein: 23.9, lipids: 14, carbs: 0, fiber: 0, calcium: 7, iron: 0.4, magnesium: 29, zinc: 0.4 } 
  },
  { 
    id: 'taco_42', group: 'Ovos', name: 'Ovo, galinha, inteiro, cozido', baseUnit: '100g', 
    householdUnit: 'unidade', householdWeight: 50, 
    nutrients: { calories: 146, protein: 13.3, lipids: 9.5, carbs: 0.6, fiber: 0, calcium: 49, iron: 1.5, magnesium: 13, zinc: 1.1 } 
  },
  { 
    id: 'taco_43', group: 'Ovos', name: 'Ovo, galinha, inteiro, frito', baseUnit: '100g', 
    householdUnit: 'unidade', householdWeight: 50, 
    nutrients: { calories: 240, protein: 15.6, lipids: 18.6, carbs: 1.2, fiber: 0, calcium: 73, iron: 2.0, magnesium: 15, zinc: 1.3 } 
  },

  // --- GRUPO 6: LEITES E DERIVADOS ---
  { 
    id: 'taco_44', group: 'Laticínios', name: 'Leite, vaca, integral', baseUnit: '100ml', 
    householdUnit: 'copo americano', householdWeight: 190, 
    nutrients: { calories: 58, protein: 3.1, lipids: 3.3, carbs: 4.6, fiber: 0, calcium: 123, iron: 0.1, magnesium: 10, zinc: 0.4 } 
  },
  { 
    id: 'taco_45', group: 'Laticínios', name: 'Leite, vaca, desnatado', baseUnit: '100ml', 
    householdUnit: 'copo americano', householdWeight: 190, 
    nutrients: { calories: 34, protein: 3.3, lipids: 0.1, carbs: 5.0, fiber: 0, calcium: 134, iron: 0.1, magnesium: 11, zinc: 0.4 } 
  },
  { 
    id: 'taco_46', group: 'Laticínios', name: 'Queijo, minas, frescal', baseUnit: '100g', 
    householdUnit: 'fatia média', householdWeight: 30, 
    nutrients: { calories: 264, protein: 17.4, lipids: 20.2, carbs: 3.2, fiber: 0, calcium: 579, iron: 0.3, magnesium: 22, zinc: 2.8 } 
  },
  { 
    id: 'taco_47', group: 'Laticínios', name: 'Queijo, mozarela', baseUnit: '100g', 
    householdUnit: 'fatia', householdWeight: 15, 
    nutrients: { calories: 330, protein: 22.6, lipids: 25.2, carbs: 3.0, fiber: 0, calcium: 875, iron: 0.3, magnesium: 26, zinc: 3.3 } 
  },
  { 
    id: 'taco_48', group: 'Laticínios', name: 'Iogurte, natural, integral', baseUnit: '100g', 
    householdUnit: 'pote', householdWeight: 170, 
    nutrients: { calories: 66, protein: 3.6, lipids: 3.5, carbs: 5.0, fiber: 0, calcium: 143, iron: 0.1, magnesium: 13, zinc: 0.5 } 
  },
  { 
    id: 'taco_49', group: 'Laticínios', name: 'Iogurte, natural, desnatado', baseUnit: '100g', 
    householdUnit: 'pote', householdWeight: 170, 
    nutrients: { calories: 41, protein: 3.8, lipids: 0.3, carbs: 5.8, fiber: 0, calcium: 157, iron: 0.1, magnesium: 14, zinc: 0.5 } 
  },

  // --- GRUPO 7: ÓLEOS E GORDURAS ---
  { 
    id: 'taco_50', group: 'Óleos', name: 'Azeite, de oliva, extra virgem', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 13, 
    nutrients: { calories: 884, protein: 0, lipids: 100, carbs: 0, fiber: 0, calcium: 0, iron: 0, magnesium: 0, zinc: 0 } 
  },
  { 
    id: 'taco_51', group: 'Óleos', name: 'Manteiga, sem sal', baseUnit: '100g', 
    householdUnit: 'ponta de faca', householdWeight: 5, 
    nutrients: { calories: 726, protein: 0.4, lipids: 82, carbs: 0.1, fiber: 0, calcium: 10, iron: 0, magnesium: 1, zinc: 0 } 
  },

  // --- GRUPO 8: AÇÚCARES E DOCES ---
  { 
    id: 'taco_52', group: 'Doces', name: 'Açúcar, cristal', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 15, 
    nutrients: { calories: 387, protein: 0, lipids: 0, carbs: 99.5, fiber: 0, calcium: 1, iron: 0.1, magnesium: 0, zinc: 0 } 
  },
  { 
    id: 'taco_53', group: 'Doces', name: 'Chocolate, meio amargo', baseUnit: '100g', 
    householdUnit: 'quadradinho', householdWeight: 7, 
    nutrients: { calories: 475, protein: 4.9, lipids: 29.9, carbs: 62.4, fiber: 6.0, calcium: 54, iron: 2.1, magnesium: 100, zinc: 1.5 } 
  },
  { 
    id: 'taco_54', group: 'Doces', name: 'Mel, de abelha', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 18, 
    nutrients: { calories: 309, protein: 0.3, lipids: 0, carbs: 84, fiber: 0, calcium: 10, iron: 0.3, magnesium: 6, zinc: 0 } 
  },
  
  // --- CASTANHAS E SEMENTES ---
  { 
    id: 'taco_55', group: 'Oleaginosas', name: 'Castanha-do-brasil (Pará), crua', baseUnit: '100g', 
    householdUnit: 'unidade', householdWeight: 4, 
    nutrients: { calories: 643, protein: 14.5, lipids: 63.5, carbs: 15.1, fiber: 7.9, calcium: 146, iron: 2.3, magnesium: 365, zinc: 4.2 } 
  },
  { 
    id: 'taco_56', group: 'Oleaginosas', name: 'Castanha-de-caju, torrada', baseUnit: '100g', 
    householdUnit: 'unidade', householdWeight: 2, 
    nutrients: { calories: 570, protein: 18.5, lipids: 46.3, carbs: 29.1, fiber: 3.5, calcium: 42, iron: 5.2, magnesium: 237, zinc: 5.6 } 
  },
  { 
    id: 'taco_57', group: 'Oleaginosas', name: 'Chia, semente', baseUnit: '100g', 
    householdUnit: 'colher de sopa', householdWeight: 12, 
    nutrients: { calories: 486, protein: 16.5, lipids: 30.7, carbs: 42.1, fiber: 34.4, calcium: 631, iron: 7.7, magnesium: 335, zinc: 4.6 } 
  },
];

// FUNCTIONAL NUTRITION OPTIMAL LAB RANGES
export const FUNCTIONAL_LABS_DATABASE = [
  // PERFIL GLICÍDICO
  { group: 'Perfil Glicídico', name: 'Glicose', unit: 'mg/dL', min: 80, max: 95 },
  { group: 'Perfil Glicídico', name: 'Homa IR', unit: '', min: 0, max: 1.2 },
  { group: 'Perfil Glicídico', name: 'Hemoglobina Glicada', unit: '%', min: 0, max: 5.4 },
  { group: 'Perfil Glicídico', name: 'Insulina', unit: 'μUI/ml', min: 0, max: 5 },

  // PERFIL LIPÍDICO
  { group: 'Perfil Lipídico', name: 'Colesterol Total', unit: 'mg/dL', min: 150, max: 220 },
  { group: 'Perfil Lipídico', name: 'HDL Colesterol', unit: 'mg/dL', min: 50, max: 60 },
  { group: 'Perfil Lipídico', name: 'LDL Colesterol', unit: 'ng/ml', min: 0, max: 100 },
  { group: 'Perfil Lipídico', name: 'Triglicerídeos', unit: 'mg/dL', min: 70, max: 110 },
  { group: 'Perfil Lipídico', name: 'APOA1/APOB', unit: '', min: 1.5, max: 99 },
  { group: 'Perfil Lipídico', name: 'Relação APOB/APOA1', unit: '', min: 0, max: 0.5 },
  { group: 'Perfil Lipídico', name: 'TGL/HDL', unit: '', min: 0, max: 1.7 },
  { group: 'Perfil Lipídico', name: 'LDH', unit: 'U/L', min: 140, max: 200 },

  // HEMOGRAMA
  { group: 'Hemograma', name: 'Hemoglobina', unit: '%', min: 13.4, max: 18 },
  { group: 'Hemograma', name: 'Leucócitos', unit: '/mm3', min: 0, max: 6500 },

  // PERFIL HEPÁTICO
  { group: 'Perfil Hepático', name: 'ALT (TGP)', unit: 'U/L', min: 10, max: 30 },
  { group: 'Perfil Hepático', name: 'AST (TGO)', unit: 'U/L', min: 10, max: 30 },
  { group: 'Perfil Hepático', name: 'Relação AST/ALT', unit: '', min: 0, max: 2.0 },
  { group: 'Perfil Hepático', name: 'Fosfatase Alcalina', unit: 'U/L', min: 70, max: 100 },
  { group: 'Perfil Hepático', name: 'Gama GT', unit: 'U/L', min: 0, max: 16 },

  // HORMONAIS
  { group: 'Hormonais', name: 'Cortisol (manhã)', unit: 'μg/dL', min: 10, max: 15 },
  { group: 'Hormonais', name: 'SDHEA', unit: 'μg/dL', min: 0, max: 150 },

  // INFLAMAÇÃO
  { group: 'Inflamação', name: 'PCR US', unit: 'mg/L', min: 0, max: 1 },
  { group: 'Inflamação', name: 'Fibrinogênio', unit: 'mg/dL', min: 0, max: 300 },
  // Ferritin handled dynamically in App.tsx due to gender

  // STATUS NUTRICIONAL
  { group: 'Status Nutricional', name: 'Cálcio', unit: 'mg/dL', min: 9.4, max: 10 },
  { group: 'Status Nutricional', name: 'Cloro', unit: 'mmol/L', min: 100, max: 106 },
  { group: 'Status Nutricional', name: 'Ferro Sérico', unit: 'μg/dL', min: 50, max: 100 },
  { group: 'Status Nutricional', name: 'Fósforo', unit: 'mg/dL', min: 3.4, max: 4.0 },
  { group: 'Status Nutricional', name: 'Magnésio', unit: 'mg/dL', min: 2.05, max: 2.6 }, // Upper limit estimated
  { group: 'Status Nutricional', name: 'Potássio', unit: 'mmol/L', min: 4.0, max: 4.5 },
  { group: 'Status Nutricional', name: 'Selênio', unit: 'mcg/L', min: 120, max: 160 },
  { group: 'Status Nutricional', name: 'Sódio', unit: 'mmol/L', min: 135, max: 142 },
  { group: 'Status Nutricional', name: '% Sat. Transferrina', unit: '%', min: 20, max: 45 },
  { group: 'Status Nutricional', name: 'Vitamina B12', unit: 'pg/ml', min: 350, max: 900 }, // Upper limit standard
  { group: 'Status Nutricional', name: 'Vitamina D', unit: 'ng/ml', min: 40, max: 65 },
  { group: 'Status Nutricional', name: 'Zinco', unit: 'mcmol/L', min: 96, max: 130 }, // Upper limit estimated

  // RENAL
  { group: 'Renal', name: 'Albumina', unit: 'g/dL', min: 4.0, max: 4.9 },
  { group: 'Renal', name: 'Razão Albumina/Globulina', unit: '', min: 1.5, max: 2.0 },
  { group: 'Renal', name: 'Creatinina', unit: 'mg/dL', min: 0.8, max: 1.1 },
  { group: 'Renal', name: 'Globulina', unit: 'd/dL', min: 2.4, max: 2.8 },
  { group: 'Renal', name: 'PTH', unit: 'pg/ml', min: 25, max: 45 },
  // Uric Acid handled dynamically

  // TIREOIDE
  { group: 'Tireoide', name: 'TSH', unit: 'μUI/ml', min: 1, max: 3.0 },
  { group: 'Tireoide', name: 'T4 Livre', unit: 'ng/dL', min: 0.8, max: 1.8 }, // Upper limit standard
  { group: 'Tireoide', name: 'T3 Livre', unit: 'pg/mL', min: 3.2, max: 4.4 }, // Upper limit standard
  { group: 'Tireoide', name: 'Relação T3L/T4L', unit: '', min: 3.0, max: 99 },
  { group: 'Tireoide', name: 'T3 Reverso', unit: 'ng/dL', min: 0.1, max: 0.25 },
  { group: 'Tireoide', name: 'T3 Total', unit: 'ng/dL', min: 60, max: 181 },
  { group: 'Tireoide', name: 'T4 Total', unit: 'μg/dL', min: 5, max: 12 },
];

// Special exams with gender differences
export const GENDER_SPECIFIC_LABS = [
    { group: 'Inflamação', name: 'Ferritina', unit: 'ng/ml', male: {min: 45, max: 200}, female: {min: 45, max: 110} },
    { group: 'Renal', name: 'Ácido Úrico', unit: 'mg/dL', male: {min: 3.3, max: 5.9}, female: {min: 3.0, max: 5.5} }
];

export const EXAM_LIST = [
  'Hemograma Completo',
  'Glicemia de Jejum',
  'Insulina Basal',
  'Hemoglobina Glicada (HbA1c)',
  'Perfil Lipídico Completo',
  'TGO (AST) / TGP (ALT)',
  'Gama GT',
  'Creatinina',
  'Ureia',
  'Ácido Úrico',
  'TSH',
  'T4 Livre',
  'Vitamina D (25-OH)',
  'Vitamina B12',
  'Ferritina',
  'Ferro Sérico',
  'Saturação de Transferrina',
  'Cálcio',
  'Magnésio',
  'Zinco',
  'Homocisteína',
  'PCR Ultrassensível',
  'Cortisol Matinal',
  'EAS (Urina Tipo 1)',
  'Parasitológico de Fezes'
];

export const calculateNutrients = (food: Food, quantity: number, type: 'grams' | 'household' = 'grams'): NutrientInfo => {
  let grams = quantity;
  if (type === 'household' && food.householdWeight) {
    grams = quantity * food.householdWeight;
  }
  
  const ratio = grams / 100;
  return {
    calories: Number((food.nutrients.calories * ratio).toFixed(1)),
    protein: Number((food.nutrients.protein * ratio).toFixed(1)),
    lipids: Number((food.nutrients.lipids * ratio).toFixed(1)),
    carbs: Number((food.nutrients.carbs * ratio).toFixed(1)),
    fiber: Number((food.nutrients.fiber * ratio).toFixed(1)),
    calcium: Number((food.nutrients.calcium * ratio).toFixed(1)),
    iron: Number((food.nutrients.iron * ratio).toFixed(1)),
    magnesium: Number((food.nutrients.magnesium * ratio).toFixed(1)),
    zinc: Number((food.nutrients.zinc * ratio).toFixed(1)),
  };
};

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getLabSuggestion = (lab: LabResult): string => {
  if (lab.category === 'normal') return 'Manter dieta equilibrada.';
  
  if (lab.name.includes('Glicose') || lab.name.includes('HbA1c') || lab.name.includes('Insulina')) {
    return lab.category === 'high' ? 'Restringir açúcares simples, aumentar fibras solúveis (aveia, psyllium). Avaliar resistência insulínica.' : 'Monitorar hipoglicemia e aporte de carboidratos.';
  }
  if (lab.name.includes('Colesterol') || lab.name.includes('LDL')) {
    return lab.category === 'high' ? 'Reduzir gorduras saturadas e trans. Aumentar consumo de fitosteróis e ômega-3.' : '';
  }
  if (lab.name.includes('Triglicerídeos')) {
    return lab.category === 'high' ? 'Reduzir carboidratos refinados (farinha branca, açúcar) e álcool. Aumentar ômega-3.' : '';
  }
  if (lab.name.includes('Magnésio')) {
    return lab.category === 'low' ? 'Aumentar folhas verdes escuras, sementes de abóbora, oleaginosas.' : 'Verificar suplementação excessiva.';
  }
  if (lab.name.includes('Zinco')) {
    return lab.category === 'low' ? 'Aumentar carnes vermelhas magras, ostras, sementes.' : '';
  }
  if (lab.name.includes('Ferro') || lab.name.includes('Ferritina')) {
      return lab.category === 'low' ? 'Aumentar carnes, feijões com vitamina C. Evitar cálcio/café nas refeições principais.' : 'Avaliar sobrecarga de ferro ou inflamação.';
  }
  if (lab.name.includes('Vitamina D')) {
      return lab.category === 'low' ? 'Suplementação de Colecalciferol e exposição solar.' : '';
  }
  if (lab.name.includes('Vitamina B12')) {
      return lab.category === 'low' ? 'Avaliar consumo de proteínas animais. Suplementação (metilcobalamina) se necessário.' : '';
  }
  if (lab.name.includes('Homocisteína') && lab.value > 10) {
      return 'Avaliar metilação. Suplementar B12, B6 e Metilfolato.';
  }
  if (lab.name.includes('PCR') && lab.value > 1) {
      return 'Sinal de inflamação. Dieta anti-inflamatória (Ômega-3, Cúrcuma, Gengibre).';
  }
  return 'Avaliar clinicamente.';
};

export const getSymptomSuggestions = (patient: PatientData): { symptom: string, suggestion: string }[] => {
  const suggestions = [];
  const s = patient.clinicalSigns;

  // 1. Clinical Signs (Hair, Skin, Nails, Dehydration)
  if (s.dehydration && s.dehydration.length > 0) {
      suggestions.push({
          symptom: 'Sinais de Desidratação',
          suggestion: `Aumentar ingestão hídrica para no mínimo ${(patient.weight * 35 / 1000).toFixed(1)}L. Monitorar cor da urina. Consumir alimentos ricos em água (melancia, melão, pepino).`
      });
  }
  
  const hairIssues = s.hair && s.hair.length > 0;
  const nailIssues = s.nails && s.nails.length > 0;
  const skinIssues = s.skin && s.skin.length > 0;

  if (hairIssues || nailIssues || skinIssues) {
      suggestions.push({
          symptom: 'Saúde de Cabelos/Pele/Unhas',
          suggestion: 'Avaliar aporte de Proteínas (Colágeno/Queratina), Zinco, Biotina, Silício, Vitamina A, C e E. Verificar funcionamento tireoidiano se queda excessiva.'
      });
  }

  // 2. GI Symptoms
  if (s.giSymptoms && s.giSymptoms.length > 0) {
      if (s.giSymptoms.includes('Refluxo') || s.giSymptoms.includes('Azia/Queimação')) {
          suggestions.push({
              symptom: 'Refluxo/Azia',
              suggestion: 'Fracionar refeições. Evitar líquidos nas refeições. Não deitar após comer. Evitar: café, chocolate, pimenta, menta, frituras.'
          });
      }
      if (s.giSymptoms.includes('Gases') || s.giSymptoms.includes('Distensão abdominal')) {
          suggestions.push({
              symptom: 'Gases/Distensão',
              suggestion: 'Avaliar protocolo Low FODMAPs. Melhorar mastigação. Realizar remolho adequado de leguminosas (feijões). Evitar chicletes e bebidas gaseificadas.'
          });
      }
      if (s.giSymptoms.includes('Constipação')) {
          suggestions.push({
              symptom: 'Constipação',
              suggestion: 'Aumentar fibras insolúveis + água. Uso de sementes (chia/linhaça), psyllium, ameixa, mamão. Considerar probióticos.'
          });
      }
      if (s.giSymptoms.includes('Diarreia')) {
          suggestions.push({
              symptom: 'Diarreia',
              suggestion: 'Dieta constipante (maçã sem casca, banana, arroz, batata). Hidratação com soro caseiro. Evitar lactose e excesso de gorduras.'
          });
      }
  }

  // 3. Eating Behavior
  if (s.eatingBehavior && s.eatingBehavior.length > 0) {
      if (s.eatingBehavior.includes('Come rápido')) {
          suggestions.push({
              symptom: 'Mastigação Rápida',
              suggestion: 'Técnicas de Mindful Eating. Descansar talheres entre garfadas. Mastigar 20-30x.'
          });
      }
      if (s.eatingBehavior.includes('Fome emocional') || s.eatingBehavior.includes('Belisca o dia todo')) {
          suggestions.push({
              symptom: 'Comportamento Beliscador/Emocional',
              suggestion: 'Identificar gatilhos. Não deixar alimentos calóricos à vista. Incluir lanches proteicos/fibras para saciedade. Chás ansiolíticos (Melissa, Mulungu).'
          });
      }
  }

  // 4. Sleep & Energy
  if (patient.sleepQuality === 'insonia' || patient.sleepQuality === 'agitado') {
      suggestions.push({
          symptom: 'Má Qualidade do Sono',
          suggestion: 'Higiene do sono rigorosa. Evitar telas 1h antes. Magnésio (Inositol/Glicina) e Triptofano no jantar (kiwi, banana, aveia). Evitar cafeína após 14h.'
      });
  }
  if (s.energyLevel === 'afternoon_crash' || s.energyLevel === 'morning_tired') {
       suggestions.push({
          symptom: 'Baixa Energia',
          suggestion: 'Avaliar carga glicêmica do almoço (evitar pico de insulina). Verificar níveis de Ferro, B12 e Tireoide. Coenzima Q10 pode auxiliar.'
      });
  }

  // 5. Lifestyle (Alcohol, Smoking, Exercise)
  if (patient.alcoholFreq && patient.alcoholFreq !== 'não') {
      suggestions.push({
          symptom: 'Consumo de Álcool',
          suggestion: 'O álcool afeta o metabolismo hepático e absorção de vitaminas do complexo B. Moderar consumo e aumentar hidratação.'
      });
  }
  if (patient.smokerFreq && patient.smokerFreq !== 'não') {
      suggestions.push({
          symptom: 'Tabagismo',
          suggestion: 'Fumantes têm maior necessidade de antioxidantes (Vitamina C, E). Risco cardiovascular aumentado. Considere cessação.'
      });
  }
  if (patient.exerciseFreq === 'não') {
      suggestions.push({
          symptom: 'Sedentarismo',
          suggestion: 'Estimular atividade física leve (caminhada 30min) para melhora da sensibilidade à insulina e saúde cardiovascular.'
      });
  }

  // 6. Women's Health
  if (patient.gender === 'female') {
      if (patient.isGestante) {
           if (s.gestationalSymptoms && s.gestationalSymptoms.includes('Enjoo matinal')) {
               suggestions.push({
                   symptom: 'Enjoo Gestacional',
                   suggestion: 'Comer algo seco (biscoito água e sal) antes de levantar. Gengibre. Fracionar refeições. Evitar estômago vazio ou muito cheio.'
               });
           }
           if (s.gestationalSymptoms && s.gestationalSymptoms.includes('Edema (inchaço)')) {
               suggestions.push({
                   symptom: 'Edema Gestacional',
                   suggestion: 'Reduzir sódio. Aumentar potássio. Elevar pernas. Drenagem linfática se liberada.'
               });
           }
      } else {
           if (s.cycleSymptoms && s.cycleSymptoms.includes('TPM intensa')) {
               suggestions.push({
                   symptom: 'TPM',
                   suggestion: 'Vitamina B6, Magnésio e Cálcio na fase lútea. Óleo de Prímula/Borragem. Reduzir sal e cafeína pré-menstruação.'
               });
           }
           if (s.cycleSymptoms && s.cycleSymptoms.includes('Compulsão por doces')) {
               suggestions.push({
                   symptom: 'Compulsão na TPM',
                   suggestion: 'Aumentar triptofano e magnésio (cacau, banana). Frutas com canela. Cromo pode auxiliar.'
               });
           }
      }
  }

  // 7. RED-S (Athletes)
  if (patient.isAthlete && s.redsSymptoms && s.redsSymptoms.length > 0) {
      suggestions.push({
          symptom: 'Alerta RED-S (Deficiência Energética)',
          suggestion: 'URGENTE: Reavaliar ingestão calórica total. Aumentar disponibilidade de energia. Focar em carboidratos peri-treino. Monitorar densidade óssea e ciclo menstrual (mulheres). Reduzir volume de treino se necessário.'
      });
  }

  // 8. Infant (0-2 years)
  if (patient.age <= 2 && s.infantObservations && s.infantObservations.length > 0) {
       if (s.infantObservations.includes('Reações na pele ou respiratórias após novos alimentos')) {
           suggestions.push({
               symptom: 'Alergia Alimentar (Infantil)',
               suggestion: 'Investigar APLV ou outras alergias. Suspender alimento suspeito e reintroduzir com cautela sob orientação. Manter diário alimentar.'
           });
       }
  }

  // 9. Neurodivergent (TEA/TDAH)
  if (patient.isNeurodivergent && s.neurodivergentSymptoms && s.neurodivergentSymptoms.length > 0) {
    const symptoms = s.neurodivergentSymptoms;
    
    // Seletividade (TEA)
    if (symptoms.includes('Recusa por Textura/Consistência') || 
        symptoms.includes('Rigidez de Marcas/Embalagem') || 
        symptoms.includes('Hiperfoco Alimentar')) {
        suggestions.push({
            symptom: 'Seletividade Alimentar (TEA)',
            suggestion: 'Aplicar a técnica de "Food Chaining" (Cadeia de Sabores). Se come batata frita, tentar batata assada em palito, depois mandioca, etc. Não forçar. Respeitar as aversões sensoriais.'
        });
    }

    // Desatenção (TDAH)
    if (symptoms.includes('Comer Distraído') || symptoms.includes('Necessidade de Incentivo')) {
        suggestions.push({
            symptom: 'Desatenção Alimentar (TDAH)',
            suggestion: 'Aumentar a densidade calórica do café da manhã (antes da medicação). Usar "snacks" fáceis e nutritivos nos intervalos para garantir aporte energético.'
        });
    }

    // Sintomas TGI (Eixo Intestino-Cérebro)
    if (symptoms.includes('Ritmo Intestinal (Constipação/Diarreia)') || symptoms.includes('Sinais de Disbiose')) {
        suggestions.push({
            symptom: 'Disbiose/Alteração Intestinal (Neurodivergência)',
            suggestion: 'Se houver constipação: Aumentar fibras (frutas, aveia) e água. Avaliar uso de probióticos específicos. Monitorar a cor e consistência das fezes (Escala de Bristol).'
        });
    }

    // Habilidades Motoras
    if (symptoms.includes('Uso de Talheres (Dificuldade)')) {
        suggestions.push({
            symptom: 'Dificuldade Motora/Talheres',
            suggestion: 'Incentivar "Finger Foods" (alimentos em bastonetes/pedaços) para autonomia, conforme método BLW adaptado. Facilitar a pegada.'
        });
    }

    // Impulsividade
    if (symptoms.includes('Impulsividade/Compulsão') || symptoms.includes('Percepção de Fome/Saciedade')) {
        suggestions.push({
            symptom: 'Impulsividade Alimentar',
            suggestion: 'Trabalhar a Escala de Fome e Saciedade (0 a 10) nas consultas para trazer consciência corporal. Evitar deixar alimentos ultraprocessados de fácil acesso.'
        });
    }
  }

  return suggestions;
}

// WHO BMI Classification for Adults
const getBMIClass = (bmi: number, age: number): string => {
  if (age < 20) {
    if (bmi < 15) return 'Magreza (Percentil Baixo)';
    if (bmi < 18.5) return 'Risco de Magreza';
    if (bmi < 25) return 'Eutrofia (Peso Normal)';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  }
  if (bmi < 18.5) return 'Magreza';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 40) return 'Obesidade';
  return 'Obesidade grave';
};

// Gallagher Formula
const calculateBodyFat = (bmi: number, age: number, gender: Gender): number => {
  const sexVal = gender === 'male' ? 1 : 0;
  return 64.5 - (848 / bmi) + (0.079 * age) - (16.4 * sexVal) + (0.05 * sexVal * age) + (39.0 * sexVal / bmi);
};

// Frisancho 1990
const getStandardValues = (gender: Gender) => {
  if (gender === 'male') {
    return { cb: 31.7, dct: 11.0, cmb: 28.2 };
  } else {
    return { cb: 29.3, dct: 20.0, cmb: 23.2 };
  }
};

export const calculateResults = (data: PatientData): CalculatedResults => {
  const heightM = data.height / 100;
  const bmi = data.weight / (heightM * heightM);
  const idealWeight = 21.7 * (heightM * heightM);
  const isMale = data.gender === 'male';
  
  // Waist-Hip Ratio (WHR / RCQ)
  let whr = 0;
  let whrRisk = 'Baixo';
  if (data.hipCirc > 0) {
    whr = data.waistCirc / data.hipCirc;
    if (isMale) {
      if (whr > 1.0) whrRisk = 'Muito Alto';
      else if (whr > 0.95) whrRisk = 'Alto';
      else if (whr > 0.90) whrRisk = 'Moderado';
    } else {
      if (whr > 0.85) whrRisk = 'Muito Alto';
      else if (whr > 0.80) whrRisk = 'Alto';
      else if (whr > 0.75) whrRisk = 'Moderado';
    }
  }

  // Water Intake
  const idealWater = data.weight * 35; // 35ml/kg
  const currentWaterMl = data.waterIntake * 1000;
  const waterDifference = currentWaterMl - idealWater;

  // Body Fat
  // Prefer BIA if available and valid (>0), else use Formula
  let bodyFatPercent = 0;
  if (data.bia && data.bia.bodyFatPercent > 0) {
      bodyFatPercent = data.bia.bodyFatPercent;
  } else {
      bodyFatPercent = calculateBodyFat(bmi, data.age, data.gender);
  }
  
  let fatMass = 0;
  if (data.bia && data.bia.fatMass > 0) {
      fatMass = data.bia.fatMass;
  } else {
      fatMass = data.weight * (bodyFatPercent / 100);
  }

  let leanMass = 0;
  if (data.bia && data.bia.leanMass > 0) {
      leanMass = data.bia.leanMass;
  } else {
      leanMass = data.weight - fatMass;
  }

  // BMR (Mifflin-St Jeor)
  let bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
  bmr += isMale ? 5 : -161;

  // VET
  let kcalFactor = 30;
  if (data.goalKcalPerKg) {
    kcalFactor = data.goalKcalPerKg;
  } else {
    if (data.weightGoal === 'lose') kcalFactor = 22.5;
    if (data.weightGoal === 'gain') kcalFactor = 32.5;
    if (data.weightGoal === 'maintain') kcalFactor = 30;
  }
  const vet = data.weight * kcalFactor;

  // Anthropometry
  const std = getStandardValues(data.gender);
  const armMuscleCirc = data.armCirc - (0.314 * data.tricepsFold);
  
  const armCircAdequacy = (data.armCirc / std.cb) * 100;
  const tricepsFoldAdequacy = (data.tricepsFold / std.dct) * 100;
  const armMuscleCircAdequacy = (armMuscleCirc / std.cmb) * 100;

  const cb = data.armCirc;
  const dctCm = data.tricepsFold / 10;
  const term = cb - (Math.PI * dctCm);
  let muscleArea = (term * term) / (4 * Math.PI);
  muscleArea -= isMale ? 10 : 6.5;

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    bmiClass: getBMIClass(bmi, data.age),
    idealWeight: parseFloat(idealWeight.toFixed(2)),
    whr: parseFloat(whr.toFixed(2)),
    whrRisk,
    bodyFatPercent: parseFloat(bodyFatPercent.toFixed(2)),
    fatMass: parseFloat(fatMass.toFixed(2)),
    leanMass: parseFloat(leanMass.toFixed(2)),
    vet: Math.round(vet),
    bmr: Math.round(bmr),
    idealWater: idealWater / 1000, // Liters
    waterDifference: waterDifference,
    armCircAdequacy: parseFloat(armCircAdequacy.toFixed(1)),
    tricepsFoldAdequacy: parseFloat(tricepsFoldAdequacy.toFixed(1)),
    armMuscleCirc: parseFloat(armMuscleCirc.toFixed(2)),
    armMuscleCircAdequacy: parseFloat(armMuscleCircAdequacy.toFixed(1)),
    correctedMuscleArea: parseFloat(muscleArea.toFixed(2)),
    isChild: data.age < 20,
    bmiPercentile: data.age < 20 ? "Verificar Curva OMS" : undefined
  };
};

// SVG Chart Path Generator
export const generateChartPath = (data: number[], width: number, height: number): string => {
  if (data.length < 2) return "";
  const max = Math.max(...data) * 1.1; // 10% padding top
  const min = Math.min(...data) * 0.9;
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * stepX;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
};
