export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null; // 1 a 5, ou null quando não tem nota
  concluida: number; // 0 ou 1 
  createdAt: string; // ISO 8601
}


export type CreateSerieInput = Omit<Serie, 'id' | 'createdAt' | 'concluida'>;

// Campos editáveis no formulário
export type UpdateSerieInput = Pick<Serie, 'titulo' | 'plataforma' | 'temporadas' | 'nota'>;

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';
