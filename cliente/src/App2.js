import React, { Component } from 'react';
import css from './app.module.css';
import ApiService from './services/ApiService';

import Title from './components/Title';
import Candidates from './components/Candidates';

/**
 * App definido como um Class Component
 */
export default class App extends Component {
  constructor() {
    /**
     * Invocação obrigatória
     * em Class Components
     */
    super();

    /**
     * Estado da aplicação
     */
    this.state = {
      candidates: [],
      totalVotes: 0,
      comecou: false,
    };

    /**
     * Referência ao interval que
     * será definido em componentDidMount
     * e executado a cada meio segundo
     */
    this.interval = null;

    /**
     * Referência ao objeto da API do backend
     */
    this.api = new ApiService('http://localhost:8080');
  }

  componentDidMount() {
    /**
     * Executando a rotina abaixo a cada
     * meio segundo (500ms)
     */
    this.interval = setInterval(async () => {
      /**
       * Obtendo JSON da API via Promise e capturando
       * os dados com async/await
       */
      const voteData = await this.api.getVotes();

      /**
       * Extraindo dados da API
       */
      const { candidates, totalVotes } = voteData;

      /**
       * Tratando os dados de candidatos
       */
      const newCandidates = this.handleCandidates(candidates, totalVotes);

      /**
       * Alterando o estado da aplicação
       * com o registro de candidatos e
       * o total de votos
       */
      this.setState({
        candidates: newCandidates,
        totalVotes,
      });
    }, 500);
  }

  /**
   * Ciclo de vida do React executado
   * quando o componente "vai morrer",
   * quando o componente "vai morrer",
   * geralmente ficar invisível em tela
   */
  componentWillUnmount() {
    /**
     * Eliminamos o interval com
     * clearInterval()
     */
    clearInterval(this.interval);
  }

  /**
   * Método para processar melhor
   * os candidatos, guardando o
   * processamento anterior
   */
  handleCandidates(candidates) {
    /**
     * Transformando o vetor de candidados atual
     */
    return candidates.map((candidate) => {
      /**
       * Extraindo id
       */
      const { id } = candidate;

      /**
       * Obtendo o candidato no estado anterior
       * ao atual, utilizando this.state
       */
      // prettier-ignore
      const previousCandidate = 
        this.state.candidates.find((item) => item.id === id);

      /**
       * Montando o objeto com os dados atuais, cálculo de percentual
       * atualizado, votos anteriores e percentual anterior
       *
       * Os dados "de anteriormente" são importantes para a animação
       * de incremento número nos votos e percentual
       */
      return {
        ...candidate,
        previousVotes: !!previousCandidate ? previousCandidate.votes : 0,
        previousPercentage: !!previousCandidate
          ? previousCandidate.percentage
          : 0,
      };
    });
  }

  handleButton = () => {
    console.log('http://localhost:8080');
    this.api.restartVotes();
    this.setState({
      comecou: true,
    });
  };

  /**
   * Principal método do ciclo de vida do React,
   * que efetua a atualização do DOM de forma
   * performática e é geralmente re-executado a
   * cada invocação de this.setState()
   */
  render() {
    /**
     * Extraindo candidates de this.state
     */
    const { candidates, comecou } = this.state;
    const { handleBotao } = this.handleButton;
    /**
     * Quebramos o app em dois componentes principais:
     * Title e Candidates, sendo que este último é
     * subdividido em diversos outros componentes
     */
    return (
      <>
        <header>
          <div className={`navbar-fixed ${css.nav}`}>
            <nav className="teal">
              <div className="navbar-home">
                <div className="content-header">
                  <div className={css.divTitulo}>
                    <img
                      className={css.logo}
                      src="logo.jpg" //""
                      alt=""
                      height="80px"
                      width="80px"
                    />
                    <div className={css.titulo}>
                      <h6 className="center">
                        <Title>Resultado</Title>
                        <Title>Qual a melhor cerveja?</Title>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
        <div className={css.divDivider}></div>
        {!comecou && (
          <div className="center">
            <button
              className="waves-effect waves-light btn-large"
              onClick={handleBotao}
            >
              Iniciar apuração
            </button>
          </div>
        )}
        {comecou && (
          <div className={`container ${css.divVoto}`}>
            <Candidates candidates={candidates} />
          </div>
        )}
      </>
    );
  }
}
