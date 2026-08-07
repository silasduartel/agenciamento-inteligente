import type { Atendimento, Campanha, Carga, Filial, Motorista, OportunidadeRetorno, Prioridade, Segmento, StatusCarga, TipoVeiculo } from "@/types";

export const filiais: Filial[] = [
  { id: "fil-01", nome: "Matriz São Paulo", cidade: "São Paulo/SP" },
  { id: "fil-02", nome: "Porto de Santos", cidade: "Santos/SP" },
  { id: "fil-03", nome: "Barcarena", cidade: "Barcarena/PA" },
  { id: "fil-04", nome: "Campinas", cidade: "Campinas/SP" },
  { id: "fil-05", nome: "Minas Centro", cidade: "Belo Horizonte/MG" },
  { id: "fil-06", nome: "Paraná Sul", cidade: "Curitiba/PR" },
  { id: "fil-07", nome: "Rio Operações", cidade: "Rio de Janeiro/RJ" },
  { id: "fil-08", nome: "Goiás Agro", cidade: "Goiânia/GO" }
];

const cidades = ["São Paulo/SP", "Santos/SP", "Barcarena/PA", "Campinas/SP", "Sorocaba/SP", "Belo Horizonte/MG", "Curitiba/PR", "Rio de Janeiro/RJ", "Ribeirão Preto/SP", "Uberlândia/MG", "Goiânia/GO", "Salvador/BA"];
const segmentos: Segmento[] = ["Inbound", "Outbound", "Novos negócios", "Construção civil", "Agro"];
const veiculos: TipoVeiculo[] = ["Toco", "Truck", "Bitruck", "Carreta", "Vanderleia", "Bitrem", "Rodotrem"];
const prioridades: Prioridade[] = ["Baixa", "Normal", "Alta", "Crítica"];
const statusCarga: StatusCarga[] = ["Rascunho", "Aguardando validação", "Disponível", "Em divulgação", "Em agenciamento", "Motorista reservado", "Confirmada", "Carregada", "Cancelada", "Com inconsistência"];
const clientes = ["Aço Brasil", "AgroVale", "Cimento Nobre", "Dutra Alimentos", "Eixo Químico", "Fênix Embalagens", "Grãos Paulista", "NortePort", "Pedra Forte", "Viva Farma"];
const produtos = ["Bobinas de aço", "Soja ensacada", "Cimento paletizado", "Alimentos secos", "Resina industrial", "Embalagens", "Fertilizantes", "Contêiner consolidado", "Brita graduada", "Medicamentos"];
const responsaveis = ["Ana Torres", "Bruno Lima", "Camila Duarte", "Diego Martins", "Elaine Rocha", "Felipe Costa"];

export const cargas: Carga[] = Array.from({ length: 40 }, (_, index) => {
  const origem = cidades[index % cidades.length];
  const outboundSemDestino = index % 13 === 0;
  const destino = outboundSemDestino ? undefined : cidades[(index + 3) % cidades.length];
  const semValor = index % 11 === 0;
  const semVeiculo = index % 17 === 0;
  const kmInconsistente = index % 19 === 0;
  const inconsistencias = [
    ...(semValor ? ["Valor não informado"] : []),
    ...(semVeiculo ? ["Tipo de veículo pendente"] : []),
    ...(kmInconsistente ? ["Quilometragem inconsistente"] : []),
    ...(index % 23 === 0 ? ["Possível duplicidade"] : [])
  ];

  return {
    id: `carga-${index + 1}`,
    codigo: `CG-${String(2400 + index).padStart(4, "0")}`,
    segmento: segmentos[index % segmentos.length],
    cliente: clientes[index % clientes.length],
    origem,
    destino,
    produto: produtos[index % produtos.length],
    carregamento: `2026-08-${String(7 + (index % 18)).padStart(2, "0")}`,
    veiculo: semVeiculo ? undefined : veiculos[index % veiculos.length],
    peso: 8 + ((index * 3) % 27),
    valorFrete: semValor ? undefined : 2800 + index * 230,
    distancia: kmInconsistente ? 48 : 120 + ((index * 73) % 1450),
    prioridade: prioridades[index % prioridades.length],
    fonte: ["Portal", "CRM", "Planilha", "Campanha", "Prospecção ativa"][index % 5],
    qualidadeDados: Math.max(42, 98 - inconsistencias.length * 18 - (index % 9)),
    motoristasCompativeis: 3 + ((index * 4) % 21),
    status: inconsistencias.length > 1 ? "Com inconsistência" : statusCarga[index % statusCarga.length],
    responsavel: responsaveis[index % responsaveis.length],
    observacoes: outboundSemDestino ? "Destino definido no carregamento, carga outbound com janela flexível." : "Carga validada com cliente e janela operacional estimada.",
    inconsistencias
  };
});

const nomes = ["Carlos Henrique", "Marcos Vinícius", "João Paulo", "Rafael Nunes", "Sandro Lopes", "Wellington Moraes", "José Roberto", "Paulo César", "André Luiz", "Renato Almeida", "Edson Vieira", "Fernando Reis", "Gilberto Ramos", "Leandro Batista", "Márcio Teixeira", "Robson Prado", "Sérgio Moreira", "Thiago Alves", "Valdir Souza", "Vitor Hugo", "Antônio Gomes", "Cláudio Pereira", "Douglas Mendes", "Elias Barbosa", "Fábio Oliveira", "Gustavo Rocha", "Ivan Martins", "Luiz Fernando", "Marcelo Dias", "Ricardo Castro"];

export const motoristas: Motorista[] = nomes.map((nome, index) => {
  const bloqueado = index % 14 === 0;
  const geoAtiva = index % 5 !== 0;
  return {
    id: `mot-${index + 1}`,
    nome,
    telefone: `(1${index % 9}) 9${String(8200 + index * 37).padStart(4, "0")}-${String(1100 + index * 53).slice(0, 4)}`,
    placa: `${["BRA", "LOG", "FRT", "RTA", "TRK"][index % 5]}-${String(1000 + index * 137).slice(0, 4)}`,
    veiculo: veiculos[index % veiculos.length],
    cidadeAtual: cidades[(index + 2) % cidades.length],
    ultimaLocalizacao: `2026-08-${String(1 + (index % 6)).padStart(2, "0")} ${String(8 + (index % 9)).padStart(2, "0")}:30`,
    geoAtiva,
    confiancaLocalizacao: geoAtiva ? 82 + (index % 15) : 38 + (index % 20),
    ultimoCarregamento: `2026-07-${String(2 + (index % 25)).padStart(2, "0")}`,
    diasSemCarregar: 3 + ((index * 7) % 74),
    viagens: 5 + index * 3,
    taxaAceite: 42 + ((index * 5) % 53),
    relacionamento: ["Ativo", "Recorrente", "Em risco", "Inativo", "Recuperação", "Novo", "Passante"][index % 7] as Motorista["relacionamento"],
    situacao: bloqueado ? "Bloqueado" : (["Aprovado", "Pendente", "Em análise", "Dados incompletos"][index % 4] as Motorista["situacao"]),
    elegivel: !bloqueado && index % 9 !== 0,
    scoreEngajamento: 48 + ((index * 6) % 50),
    rotasFrequentes: [`${cidades[index % cidades.length]} → ${cidades[(index + 4) % cidades.length]}`, `${cidades[(index + 1) % cidades.length]} → ${cidades[(index + 6) % cidades.length]}`],
    restricoes: bloqueado ? ["Restrição operacional ativa", "Cadastro bloqueado para reserva"] : index % 9 === 0 ? ["Documento pendente"] : []
  };
});

export const oportunidadesRetorno: OportunidadeRetorno[] = Array.from({ length: 20 }, (_, index) => ({
  id: `ret-${index + 1}`,
  motoristaId: motoristas[index % motoristas.length].id,
  viagemAtual: `${cidades[index % cidades.length]} → ${cidades[(index + 5) % cidades.length]}`,
  destinoAtual: cidades[(index + 5) % cidades.length],
  chegada: `2026-08-${String(7 + (index % 12)).padStart(2, "0")} ${String(9 + (index % 8)).padStart(2, "0")}:00`,
  cargaRetorno: cargas[(index * 2) % cargas.length].codigo,
  distanciaProximaOrigem: 18 + ((index * 17) % 260),
  compatibilidadeVeiculo: 70 + (index % 28),
  valorEstimado: 3100 + index * 310,
  margemEstimada: 480 + index * 57,
  score: 61 + ((index * 4) % 36),
  confiancaLocalizacao: 48 + ((index * 7) % 50),
  status: ["Oportunidade identificada", "Aguardando janela ideal", "Oferta preparada", "Oferta enviada", "Motorista interessado", "Reservado", "Recusado", "Expirado"][index % 8]
}));

export const campanhas: Campanha[] = Array.from({ length: 10 }, (_, index) => ({
  id: `camp-${index + 1}`,
  nome: ["Cargas SP-Sul", "Retorno Santos", "Recuperação 45 dias", "Atualização cadastral", "Geo ativa agosto", "Carga urgente agro", "Bitrem Minas", "Outbound Nordeste", "Truck Campinas", "Reativação passantes"][index],
  tipo: ["Divulgação de cargas", "Frete de retorno", "Recuperação de motorista", "Atualização cadastral", "Ativação de geolocalização", "Carga urgente"][index % 6],
  publico: ["Motoristas elegíveis", "Carretas próximas", "Inativos recentes", "Cadastro pendente", "Geolocalização inativa"][index % 5],
  destinatarios: 80 + index * 37,
  status: ["Rascunho", "Agendada", "Enviada", "Pausada", "Concluída"][index % 5],
  data: `2026-08-${String(1 + index).padStart(2, "0")}`,
  leitura: 42 + index * 4,
  interesse: 12 + index * 3,
  conversao: 4 + index
}));

export const atendimentos: Atendimento[] = Array.from({ length: 25 }, (_, index) => ({
  id: `at-${index + 1}`,
  motoristaId: motoristas[index % motoristas.length].id,
  cargaId: cargas[(index * 3) % cargas.length].id,
  status: ["Novo", "Em atendimento", "Aguardando motorista", "Interessado", "Em qualificação", "Encaminhado para operações", "Reservado", "Sem interesse", "Sem resposta", "Encerrado"][index % 10],
  canal: ["WhatsApp", "Telefone", "E-mail", "Portal"][index % 4],
  responsavel: responsaveis[index % responsaveis.length],
  atualizadoEm: `2026-08-06 ${String(8 + (index % 9)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`,
  mensagens: [
    { autor: "Operador", texto: "Olá, temos uma carga compatível com seu veículo. Pode avaliar?", hora: "09:10" },
    { autor: "Motorista", texto: index % 3 === 0 ? "Tenho interesse, preciso confirmar a janela." : "Pode mandar os detalhes da carga.", hora: "09:13" },
    { autor: "Operador", texto: "Enviei origem, destino, valor e horário previsto. Fico no aguardo.", hora: "09:15" }
  ]
}));

export const chartSeries = {
  cargasMes: [
    { dia: "01/08", recebidas: 44, agenciadas: 26 },
    { dia: "02/08", recebidas: 51, agenciadas: 31 },
    { dia: "03/08", recebidas: 37, agenciadas: 29 },
    { dia: "04/08", recebidas: 62, agenciadas: 42 },
    { dia: "05/08", recebidas: 58, agenciadas: 46 },
    { dia: "06/08", recebidas: 71, agenciadas: 53 }
  ],
  canais: [
    { canal: "Portal", valor: 34 },
    { canal: "Campanha", valor: 28 },
    { canal: "Prospecção", valor: 18 },
    { canal: "Retorno", valor: 20 }
  ],
  motoristas: [
    { semana: "S1", ativados: 32 },
    { semana: "S2", ativados: 46 },
    { semana: "S3", ativados: 53 },
    { semana: "S4", ativados: 67 }
  ],
  funil: [
    { etapa: "Contatados", total: 1260 },
    { etapa: "Interessados", total: 438 },
    { etapa: "Qualificados", total: 291 },
    { etapa: "Reservados", total: 164 },
    { etapa: "Carregados", total: 132 }
  ]
};
