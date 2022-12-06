import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionItem from './QuestionItem.jsx';
import SearchBar from './SearchBar.jsx';
import MoreButton from '../Shared/MoreButton.jsx';
import token from '../../../../config.js';
import styled, { css } from 'styled-components';
import { result } from 'lodash';
import sortResults from '../../utils/helper.js';


/* Define style for component*/
const Container = styled.div`
  display: grid;
  max-height: 100vh;
  color: white;
  grid-template-columns: 0.4fr 0.6fr;
  grid-template-rows: 0.1fr 0.1fr 0.65fr 0.15fr;

  grid-template-areas:
    "header header"
    "search search"
    "list list"
    "moreQBtn askBtn";
  text-align: left;
  grid-gap: 1rem;
 `;

const Header = styled.div`
  color:grey;
  grid-area: header;
  ${'' /* padding: 0.25rem; */}
`;

const Search = styled.div`
  ${'' /* background: #01BAEF; */}
  grid-area: search;
  padding: 0.25rem;
`;
const QAList = styled.div`
  background: #0CBABA;
  grid-area: list;
  padding: 0.25rem;
  ${'' /* max-height: 100vh; */}
  ${'' /* overflow: auto; */}
`;
const MoreQuestionBtn = styled.div`
  ${'' /* background: #FFD3BA; */}
  grid-area: moreQBtn;
  padding: 0.25rem;
`;

const AskQuestionBtn = styled.div`
  ${'' /* background: #FFD3BA; */}
  grid-area: askBtn;
  padding: 0.25rem;
`;

export default function Questions({ renderedProduct }) {

  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  useEffect(() => {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${renderedProduct.id}`, { headers: { Authorization: token.TOKEN } })
      .then((response) => {
        console.log('Client side response is : ', response.data);
        let sortedResults = sortResults(response.data.results, 'question_helpfulness',(result) => {
          setQuestions(result);
          setDisplayedQuestions(result.slice(0, 2));
        });

        ;
      })
      .catch((error) => {
        console.log('Client side error is : ', error);
      });
  }, [renderedProduct]);

  /* Filter for questions */
  const searchQuestion = (keyWord) => {
    console.log('Search questions with keyword : ', keyWord);
    let results = [];
    questions.forEach((question, index) => {
      if (question.question_body.toLowerCase().includes(keyWord)) {
        console.log('find a match in question');
        results.push(question);
      } else {
        Object.values(question.answers).forEach((answer) => {
          if (answer.body.toLowerCase().includes(keyWord)) {
            console.log('find a match in answer')
            results.push(question);
          }
        })
      }
    })
    console.log('search result is : ', results);
    setDisplayedQuestions(results);
  }

  return (
    <Container>
      <Header>
        QUESTIONS & ANSWERS
      </Header>

      <Search>
        <SearchBar searchQuestion={searchQuestion} />
      </Search>
      <QAList>
        {displayedQuestions.length > 0 ? displayedQuestions.map((question, index) => <QuestionItem question={question} key={index} />) : 'Still loading'}
      </QAList>
      <MoreQuestionBtn>
        <MoreButton buttonName='MORE ANSWERED QUESTIONS' />
      </MoreQuestionBtn>
      <AskQuestionBtn>
        <MoreButton buttonName='ADD A QUESTION +' />
      </AskQuestionBtn>
    </Container>
  );
}
