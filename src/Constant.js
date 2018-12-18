const getApiUrl = () => {
  return process.env.REACT_APP_API_URL;
}

const apiUrl = getApiUrl();

const normalBalanceTypes = [
  {value: 'DEBIT', label: 'Debit'},
  {value: 'CREDIT', label: 'Credit'}
]

const accountTypes = [
  {value: 'ASSETS', label: 'Assets'},
  {value: 'LIABILITIES', label: 'Liabilities'},
  {value: 'OWNERS_CAPITAL', label: 'Owners Capital'},
  {value: 'WITHDRAWALS', label: 'Withdrawals'},
  {value: 'REVENUES', label: 'Revenues'},
  {value: 'EXPENSES', label: 'Expenses'},
]

const datePickerFormat = 'YYYY-MM-DD';

export { apiUrl, accountTypes, normalBalanceTypes, datePickerFormat }