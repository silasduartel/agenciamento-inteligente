export type Segmento = "Inbound" | "Outbound" | "Novos negócios" | "Construção civil" | "Agro";
export type TipoVeiculo = "Toco" | "Truck" | "Bitruck" | "Carreta" | "Vanderleia" | "Bitrem" | "Rodotrem";
export type Prioridade = "Baixa" | "Normal" | "Alta" | "Crítica";

export type StatusCarga =
  | "Rascunho"
  | "Aguardando validação"
  | "Disponível"
  | "Em divulgação"
  | "Em agenciamento"
  | "Motorista reservado"
  | "Confirmada"
  | "Carregada"
  | "Cancelada"
  | "Com inconsistência";

export type Carga = {
  id: string;
  codigo: string;
  segmento: Segmento;
  cliente: string;
  origem: string;
  destino?: string;
  produto: string;
  carregamento: string;
  veiculo?: TipoVeiculo;
  peso: number;
  valorFrete?: number;
  distancia: number;
  prioridade: Prioridade;
  fonte: string;
  qualidadeDados: number;
  motoristasCompativeis: number;
  status: StatusCarga;
  responsavel: string;
  observacoes: string;
  inconsistencias: string[];
};

export type StatusRelacionamento = "Ativo" | "Recorrente" | "Em risco" | "Inativo" | "Recuperação" | "Novo" | "Passante";
export type SituacaoCadastral = "Aprovado" | "Pendente" | "Bloqueado" | "Em análise" | "Dados incompletos";

export type Motorista = {
  id: string;
  nome: string;
  telefone: string;
  placa: string;
  veiculo: TipoVeiculo;
  cidadeAtual: string;
  ultimaLocalizacao: string;
  geoAtiva: boolean;
  confiancaLocalizacao: number;
  ultimoCarregamento: string;
  diasSemCarregar: number;
  viagens: number;
  taxaAceite: number;
  relacionamento: StatusRelacionamento;
  situacao: SituacaoCadastral;
  elegivel: boolean;
  scoreEngajamento: number;
  rotasFrequentes: string[];
  restricoes: string[];
};

export type OportunidadeRetorno = {
  id: string;
  motoristaId: string;
  viagemAtual: string;
  destinoAtual: string;
  chegada: string;
  cargaRetorno: string;
  distanciaProximaOrigem: number;
  compatibilidadeVeiculo: number;
  valorEstimado: number;
  margemEstimada: number;
  score: number;
  confiancaLocalizacao: number;
  status: string;
};

export type Campanha = {
  id: string;
  nome: string;
  tipo: string;
  publico: string;
  destinatarios: number;
  status: string;
  data: string;
  leitura: number;
  interesse: number;
  conversao: number;
};

export type Atendimento = {
  id: string;
  motoristaId: string;
  cargaId: string;
  status: string;
  canal: string;
  responsavel: string;
  atualizadoEm: string;
  mensagens: { autor: "Motorista" | "Operador"; texto: string; hora: string }[];
};

export type Filial = {
  id: string;
  nome: string;
  cidade: string;
};

export type Notificacao = {
  id: string;
  titulo: string;
  tipo: "info" | "sucesso" | "alerta" | "erro";
};
