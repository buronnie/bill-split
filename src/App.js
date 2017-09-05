import React, { Component } from 'react';
import './App.css';

const DEFAULT_BILL_STATE = {value: 0, shouldPay: 0};
const TAX_RATE = 0.0725;
const TIP_RATE = 0.15;

const addTaxTip = beforeTax => (beforeTax * (1 + TAX_RATE + TIP_RATE)).toFixed(2);
const tip = beforeTax => (beforeTax * TIP_RATE).toFixed(2);

class App extends Component {
  state = {
    totalBeforeTax: 0,
    paySame: false,
    bills: [
      DEFAULT_BILL_STATE,
      DEFAULT_BILL_STATE
    ]
  };

  handlePeopleChange = (ev) => {
    const people = parseInt(ev.target.value, 10);
    if (this.state.bills.length === people) {
      return;
    }
    if (this.state.bills.length < people) {
      const addedBills = []
      for (let i = 0; i < people - this.state.bills.length; i++) {
        addedBills.push(DEFAULT_BILL_STATE);
      }
      this.setState({
        bills: this.state.bills.concat(addedBills)
      }, this.updateBills)
    } else {
      this.setState({
        bills: this.state.bills.slice(0, people)
      }, this.updateBills)
    }
  };

  handleTotalChange = (ev) => {
    const total = parseFloat(ev.target.value);
    this.setState({ totalBeforeTax: total }, this.updateBills);
  };

  updateBills = () => {
    if (this.state.paySame) {
      this.calcBillsOfSamePay();
    }
  };

  calcBillsOfSamePay = () => {
    const people = this.state.bills.length;
    const eachPayBeforeTax = (this.state.totalBeforeTax / people).toFixed(2);
    const eachPayAfterTax = addTaxTip(eachPayBeforeTax);
    const eachPay = {
      value: eachPayBeforeTax,
      shouldPay: eachPayAfterTax,
    };
    const newBills = []
    for (let i = 0; i < people; i++) {
      newBills.push(eachPay);
    }
    this.setState({
      bills: newBills,
    });
  };

  handleCheckboxChange = (ev) => {
    this.setState({ paySame: ev.target.checked }, this.updateBills);
  };

  handleBillChange = (ev) => {
    const index = parseInt(ev.target.name.split("-")[1], 10);
    const value = parseFloat(ev.target.value);
    const shouldPay = addTaxTip(value);
    const bills = this.state.bills;
    this.setState({
      bills: bills.slice(0, index).concat({value, shouldPay}).concat(bills.slice(index+1))
    })
  };

  renderPeopleList = () => {
    return this.state.bills.map((bill, index) => {
      return (
        <div className="form-group row" key={index}>
          <div className="col-3">
            <input name={`bill-${index}`} className="form-control" type="number" value={bill.value} onChange={this.handleBillChange} />
          </div>
          <div className="col-3">
            <input className="form-control" type="text" readOnly value={bill.shouldPay}/>
          </div>
        </div>
      )
    });
  };

  billsSum = () => {
    return this.state.bills.reduce((sum, bill) => sum += parseFloat(bill.value), 0);
  };

  isTotalMismatched = () => {
    if (this.state.paySame) {
      return false;
    }
    return this.state.totalBeforeTax !== this.billsSum();
  };

  render() {
    const manualInputTotal = this.billsSum();
    const dangerFormGroup = this.isTotalMismatched() ? 'has-danger' : '';
    const dangerFormControl = this.isTotalMismatched() ? 'form-control-danger' : '';

    return (
      <div className="App bootstrap">
        <h4 >Split <span role="img" aria-label="money">💵</span></h4>
        <hr />
        <form>
          <div className="form-group">
            <label htmlFor="peopleCount">People</label>
            <div className="col-5">
              <select className="form-control" id="peopleCount" onChange={this.handlePeopleChange}>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </div>
          </div>
          <div className={`form-group ${dangerFormGroup}`}>
            <label htmlFor="total">Total Before Tax</label>
            <div className="col-5">
              <input className={`form-control ${dangerFormControl}`} type="number" id="total" value={this.state.totalBeforeTax} onChange={this.handleTotalChange} />
              <div className="text-muted">manual input total: {manualInputTotal}</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="tip">Tip</label>
            <div className="col-5">
              <input className="form-control" type="number" id="tip" value={tip(this.state.totalBeforeTax)} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="total-paid">Total Paid</label>
            <div className="col-5">
              <input className="form-control" type="number" id="total-paid" value={addTaxTip(this.state.totalBeforeTax)} readOnly />
            </div>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" onChange={this.handleCheckboxChange} />
              <span>Everyone pays the same</span>
            </label>
          </div>
          <hr />
          {this.renderPeopleList()}
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
