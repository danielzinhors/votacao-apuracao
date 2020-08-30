let candidates = [];
let intervalVotes = null;
let intervalPopularity = null;

const CONSTS = {
  MAX_POPULARITY: 10,
  MIN_POPULARITY: 1,
  MIN_VOTES: 1,
  MAX_VOTES: 1000,
  INTERVAL_VOTES: 100,
  INTERVAL_POPULARITY: 10000,
};

function generateRandomNumber(from = CONSTS.MIN_VOTES, to = CONSTS.MAX_VOTES) {
  return Math.max(from, Math.ceil(Math.random() * to));
}

function fillCandidates() {
  candidates = [
    {
      id: 1,
      name: 'Petroleo',
      votes: 0,
      percentage: 0,
      popularity: CONSTS.MIN_POPULARITY,
    },

    {
      id: 2,
      name: 'Deus',
      votes: 0,
      percentage: 0,
      popularity: CONSTS.MIN_POPULARITY,
    },

    {
      id: 3,
      name: 'Guinness',
      votes: 0,
      percentage: 0,
      popularity: CONSTS.MIN_POPULARITY,
    },
  ];
}

function simulateVoting() {
  intervalVotes = setInterval(() => {
    candidates.forEach((candidate) => {
      const minVotes = CONSTS.MIN_VOTES;
      const maxVotes = CONSTS.MAX_VOTES * candidate.popularity;
      candidate.votes += generateRandomNumber(minVotes, maxVotes);
    });
  }, CONSTS.INTERVAL_VOTES);
}

function simulatePopularity() {
  intervalPopularity = setInterval(() => {
    candidates.forEach((candidate) => {
      candidate.popularity = generateRandomNumber(
        CONSTS.MIN_POPULARITY,
        CONSTS.MAX_POPULARITY
      );
    });

    console.log(candidates);
  }, CONSTS.INTERVAL_POPULARITY);
}

const findAll = async (_, res) => {
  try {
    const sortedCandidates = Object.assign([], candidates);
    sortedCandidates.sort((a, b) => b.votes - a.votes);
    const totalVotes = sortedCandidates.reduce((accumulator, current) => {
      return accumulator + current.votes;
    }, 0);
    sortedCandidates.forEach((candidate) => {
      candidate.percentage = (candidate.votes / totalVotes) * 100;
    });
    console.log({ candidates: sortedCandidates, totalVotes });
    res.json({ candidates: sortedCandidates, totalVotes });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Erro ao listar todos os votos',
    });
    logger.error(`GET /votes - ${JSON.stringify(error.message)}`);
  }
};

const restart = async (_, res) => {
  try {
    fillCandidates();
    simulateVoting();
    simulatePopularity();
    res.json({
      message: 'Votação ' + 'Reiniciada.',
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Erro ao reiniciar',
    });
    logger.error(`post erro ao reiniciar - ${JSON.stringify(error.message)}`);
  }
};

export default { findAll, restart };
