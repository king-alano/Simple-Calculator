/*
name: AJ Boyd
date: 7/13/23
desc: this is a simple 4-function calculator web project
*/

//Calculator class
class Calculator{
  constructor(){
    this.history = ""; //history string
    this.result = "0"; //result string
    this.maxLength = 9; //maximum length of buffer
    this.num1 = null; //stored as strings until they get parsed
    this.num2 = null; //stored as strings until they get parsed
    this.operator = null; //the operation being done
    this.ans = null; //stored as an integer/float
    this.calced = false; //flag for knowing is an answer was just evaluated
    this.num1Float = false; //if num1 is tagged as a float
    this.num2Float = false; //if num2 is tagged as a float
    this.num1Neg = false; //if num1 is tagged as negative
    this.num2Neg = false; //if num2 is tagged as negative
  }
  //accessors and mutators
  getHistory(){
    return this.history;
  }
  getResult(){
    return this.result;
  }
  setHistory(h){
    this.history = h;
  }
  setResult(r){
    this.result = r;
  }

  //handles appending numbers to the result string
  //param: token--the number to be appeneded to the result string
  append(token){
    //for an empty display
    if(this.getResult() == "0" || this.calced){
      this.setResult(this.unformatted(token));
      this.setHistory("Ans=" + this.formatted(this.ans));
      document.getElementById("history").innerHTML = this.getHistory();
    }
    else if(this.getResult == "-0"){
      this.setResult("-" + this.unformatted(token));
      console.log("a2 = " + this.result)
    }
    //for when clearing from previous answer
    else if(this.ans && !this.calced && String(this.ans) == this.getResult() && !this.operator){
      this.setResult(this.unformatted(token));
      this.ans = null;  
    }else{
      if(this.getResult().replace(/,|\.|-/g, "").length < this.maxLength){
          this.setResult(this.getResult() + token)
      }
    }
    this.calced = false;
    if(this.num1Float || this.num2Float)
      this.displayFloat();
    else
      this.display();
  }

  //function resets the calculator object
  clear(){
    this.setResult("0");
    this.num1 = null;
    this.num2 = null;
    this.operator = null;
    this.calced = false;
    this.num1Float = false; 
    this.num2Float = false;
    this.num1Neg = false;
    this.num2Neg = false;
    this.display();
  }

  //acts as a backspace button on the calculator
  clearEntry(){
    //if just one entry or if clearing the answer, call clear()
    if(this.getResult().length <= 1 || this.calced || this.getResult() == "-0"){
      this.clear();
    }else{
      if(this.num2){
        //if num2 exists, re-define it
        var num2Str = this.getResult().substring(1 + this.getResult().indexOf(this.operator))
        this.num2 = num2Str.substring(0, num2Str.length-1)
        this.setResult(this.num1 + this.operator + this.num2);

        //if num2 is deleted, return it to null
        if(this.num2 == ""){
          this.num2 = null;
        }   
      }
      //deleting the operator
      else if(this.num1 && this.operator){
        let r = this.getResult();
        this.setResult(r.substring(0, r.length - 1));
        this.operator = null;
        this.num1 = null;
        this.num2 = null;
      }
      //deleting num1
      else{
        let r = this.getResult();
        this.setResult(r.substring(0, r.length - 1));

        //special casse for when result ends in a . or - after removing last token
        if(this.getResult().endsWith(".")){
          this.displayFloat();
          return;
        }else if(this.getResult().endsWith("-")){
          this.clearEntry();
        }
      }
      
      this.display();
    }
  }

  //handles displaying standard outputs
  display(){
    //if building first number
    if(this.num1 == null){
      if(Number.isNaN(Number(this.formatted(this.getResult()))))
         this.displayFloat()
      else
        document.getElementById("result").innerHTML = this.formatted(this.getResult()); 
    }
    //if starting to build second number
    else if(this.num1 && this.num2 == null){
      this.num2 = this.getResult().substring(1 + this.getResult().indexOf(this.operator))
      document.getElementById("result").innerHTML = this.formatted(this.num1) + this.operator;
    }else{
      this.num2 = this.getResult().substring(1 + this.getResult().indexOf(this.operator))
      document.getElementById("result").innerHTML = this.formatted(this.num1) + this.operator + this.formatted(this.num2);
    }
  }

  //handles displaying special outputs
  displayFloat(){
    if(this.operator)
      this.num2 = this.getResult().substring(1 + this.getResult().indexOf(this.operator))
    document.getElementById("result").innerHTML = this.result;
  }

  //handles displaying the result of an evaluated equation
  displayResult(){
    if(this.num1 && this.num2){
      (this.evaluate());
      this.history = this.result + "=";
      document.getElementById("history").innerHTML = this.getHistory();   
      document.getElementById("result").innerHTML = this.formatted(String(this.ans)); 
      if(Number.isInteger(this.ans))
         this.result = this.unformatted(String(this.ans))
      else{
        this.result = this.unformatted(String(parseFloat(this.ans.toFixed(3))))
      }
      //this.result = this.unformatted(String(this.ans))
      this.calced = true;
    }
  }

  //evaluates the equation
  evaluate(){
    (this.num2)
    //parses num1
    if(this.num1.includes(".")){
      this.num1 = parseFloat(this.num1);
    }else{
      this.num1 = parseInt(this.num1);
    }

    //parses num2
    if(this.num2.includes(".")){
      this.num2 = parseFloat(this.num2);
     }else{
      this.num2 = parseInt(this.num2);
    }

    //does the operation according to the operator
    if(this.operator == "+"){
      this.ans = this.num1 + this.num2;
    }else if(this.operator == "–"){
      this.ans = this.num1 - this.num2;
    }else if(this.operator == "×"){
      this.ans = this.num1 * this.num2;
    }else if(this.operator == "÷"){
      this.ans = this.num1 / this.num2;
    }

    //resets key values
    this.num1 = null;
    this.num2 = null;
    this.operator = null;
    this.num2Float = false;
    this.num1Neg = (this.ans < 0);
    this.num2Neg = false;

    //returns the answer
    return this.ans;
  }

  //takes in an integer or unformatted string and parses it into a formatted string
  formatted(number){
    number = Number(number)
    //alert("number before formatting: "+ number)
    return number.toLocaleString();
  }

  //handles float parsing
  makeFloat(){
    //turning ans to a float
    if(this.calced){
      this.result = "0.";
      this.calced = false;
    }
    //turning num1 to a float
    else if(!this.operator){
      if(!this.num1Float){
        this.result += ".";
        this.num1Float = true;
      }
    }
    //turning num2 to a float
    else{
      if(!this.num2Float){
        this.result += ".";
        this.num2Float = true;
      }
    }
    this.displayFloat();
  }

  //handles operations
  operation(token){
    if(this.num2 == null){
      if(this.operator == null){
        this.operator = token;
        this.num1 = this.unformatted(this.getResult());
        this.setResult(this.getResult() + token)
        this.display();
        if(this.ans){
           this.setHistory("Ans=" + this.formatted(this.ans))
           document.getElementById("history").innerHTML = this.getHistory();
        }
      }
    }
    this.calced = false;
  }

  //handles negative numbers
  negate(){
    if(!this.operator){
      if(this.num1Neg)
        this.result = this.result.replace(/-/g, "");
      else
        this.result = "-" + this.result;
      this.num1Neg = !this.num1Neg;
    }
    //negating num2
    else{
      if(this.num2Neg){
        this.result = this.result.substring(0, this.result.indexOf(this.operator) + 1)  + this.num2.replace(/-/g, "");
      }else
        this.result = this.result.substring(0, this.result.indexOf(this.operator) + 1) + "-" + this.num2;
      this.num2Neg = !this.num2Neg;
    }
    
    if(Number.isNaN(Number(this.formatted(this.result)))){
      this.displayFloat();
    }
    else
      this.display();
  }
  
  //takes a formatted string and puts it as an integer
  unformatted(number){
    return number.replace(/,/g, "");
  }
}

//create calculator object
let calc = new Calculator();

//wrapper functions
function append(token){
  calc.append(token)
}

function c(){
  calc.clear();
}

function ce(){
  calc.clearEntry();
}

function operator(token){
  calc.operation(token)
}

function eval(){
  calc.displayResult();
}

function mf(){
  calc.makeFloat();
}

function neg(){
  calc.negate();
}