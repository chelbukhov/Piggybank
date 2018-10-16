import React, { Component } from 'react';
import web3 from './web3';        // импорт файла с настройками web3
import bank from './PiggyBank';  //импорт файла с привязкой к адресу контракта и ABI-кодом
import token from './PiggyToken';  //импорт файла с привязкой к адресу контракта и ABI-кодом
//import logo from './logo.svg';
import './App.css';




class App extends Component {


  state = {                               // инициализация состояния свойств компонента
    balance: 0,     	// баланс адреса контракта банка
    addressDepo: '',  //адрес депозита
    tokenPrice: 0,  // стоимость токена
    balanceDepo: 0,  //баланс депозита
    balanceDepoETH: 0, //баланс депозита в эфирах
    daysFromStart: ''   //сколько днея работает проект

  };

  async componentDidMount(){            // будет вызываться всякий раз при отображении

    let date1 = new Date("10/14/2018");
    let date2 = new Date();
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    //alert(diffDays);
    this.setState({daysFromStart: diffDays});

    const decimals = 10**18;
    
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
      // eslint-disable-next-line
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    // получение данный по контракту банка
    let balance = 0;
    balance = await web3.eth.getBalance(bank.options.address); //получить баланс адреса контракта
    balance = (balance / decimals).toFixed(4);
    this.setState({balance});           

    // получение данный по контракту токена
    let tokenPrice = 0;
    tokenPrice = await ((await bank.methods.rate().call()) / decimals).toFixed(4); //получить баланс вклада
    this.setState({tokenPrice});         
    
    //получаем куку адреса депозита
    let addressDepo = getCookie("addressDepo");
    try {
      if (addressDepo !== undefined) {
        //устанавливаем данные по депозиту
        this.setState({addressDepo});
        let balanceDepo = await ((await token.methods.balanceOf(this.state.addressDepo).call()) / decimals).toFixed(4); //получить баланс вклада
        this.setState({balanceDepo});
        let balanceDepoETH = (balanceDepo * tokenPrice).toFixed(4);
        this.setState({balanceDepoETH});
      }
    } catch (error) {
      alert(error);      
    }


  };
  ChangeAddress = async (event) => {
    const decimals = 10**18;
    event.preventDefault();
      try {
        if (this.state.addressDepo.length === 42){
          //alert( document.cookie );
          //alert(this.state.addressDepo);
          //получаем баланс депозита
          let balanceDepo = await ((await token.methods.balanceOf(this.state.addressDepo).call()) / decimals).toFixed(4); //получить баланс вклада
          this.setState({balanceDepo});
          //alert(this.state.balanceDepo);

          let balanceDepoETH = (balanceDepo * this.state.tokenPrice).toFixed(4);
          this.setState({balanceDepoETH});
    
          var date = new Date(new Date().getTime() + 60 * 60 * 24 * 14 * 1000);
          document.cookie = "addressDepo=" + this.state.addressDepo + "; path=/; expires=" + date.toUTCString();
        };
  
        } catch (error) {
      alert (error);      
      };
  };

  render() {
    return (
      <div className="App">
        {this.state.tokenPrice === 0 ? (
          <div>
            <h3 class="title">Нет данных из смарт-контракта, подождите...</h3>
            <p> <span class="title">Если даныне не обновились в течение нескольких секунд, попробуйте обновить страницу или сменить браузер.</span></p>
          </div>
        ) : (
          <div>
            <h3 class="title">С 14.10.2018 стоимость токена выросла на: <span class="digit">{((this.state.tokenPrice - 1) * 100).toFixed(1)}</span> %.</h3>
            <h3 class="title">Стоимость токена <span class="ETH">PiggyToken</span>:  <span class="digit">{this.state.tokenPrice}</span> Ether.</h3>

            <div>
            <form onSubmit={this.ChangeAddress}>
                                        <p>
                                          <h2><input 
                                              type="text"
                                              value = {this.state.addressDepo}
                                              placeholder="...Введите адрес депозита..."
                                              onChange={event => 
                                                this.setState({addressDepo: event.target.value})}
                                              /> 
                                              
                                          </h2> 
                                          
                                        </p>
            </form>
            <p> <span class="title">Ваш вклад в токенах:</span> <span class="digit">{this.state.balanceDepo}</span> <span class="ETH">PiggyToken</span>.</p>
            <p> <span class="title">Ваш вклад в эфирах:</span> <span class="digit">{this.state.balanceDepoETH}</span> <span class="title">Ether</span>.</p>
            <p> <span class="text">Эту сумму Вы можете забрать в любое время дня и ночи <span class="ETH">БЕЗ комиссий.</span></span></p>
            </div>
          </div>  
        )}
      </div>
    );
  }
}

export default App;
