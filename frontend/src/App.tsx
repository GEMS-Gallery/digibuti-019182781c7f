import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#007bff',
  borderRadius: '8px',
}));

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  color: '#007bff',
  '&:hover': {
    backgroundColor: '#e2e6ea',
  },
}));

const EqualsButton = styled(CalculatorButton)(({ theme }) => ({
  backgroundColor: '#28a745',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#218838',
  },
}));

const Display = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontSize: '2rem',
    textAlign: 'right',
    padding: theme.spacing(1),
    backgroundColor: '#ffffff',
  },
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  useEffect(() => {
    const fetchInitialResult = async () => {
      const result = await backend.getResult();
      setDisplay(result.toString());
    };
    fetchInitialResult();
  }, []);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = async () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    await backend.clear();
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      performCalculation(operator, inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) return;

    const result = await backend.calculate(firstOperand, secondOperand, op);
    if (result && result.length > 0) {
      setDisplay(result[0].toString());
      setFirstOperand(result[0]);
    } else {
      setDisplay('Error');
    }
  };

  return (
    <CalculatorPaper elevation={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Display
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(
          (btn) => (
            <Grid item xs={3} key={btn}>
              {btn === '=' ? (
                <EqualsButton
                  fullWidth
                  variant="contained"
                  onClick={() => operator && performCalculation(operator, parseFloat(display))}
                >
                  {btn}
                </EqualsButton>
              ) : (
                <CalculatorButton
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    if (btn === '+' || btn === '-' || btn === '*' || btn === '/') {
                      handleOperator(btn);
                    } else if (btn === '.') {
                      inputDecimal();
                    } else {
                      inputDigit(btn);
                    }
                  }}
                >
                  {btn}
                </CalculatorButton>
              )}
            </Grid>
          )
        )}
        <Grid item xs={12}>
          <CalculatorButton fullWidth variant="contained" onClick={clear}>
            Clear
          </CalculatorButton>
        </Grid>
      </Grid>
    </CalculatorPaper>
  );
};

export default App;
