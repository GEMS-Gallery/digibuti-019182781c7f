import Result "mo:base/Result";

import Float "mo:base/Float";
import Text "mo:base/Text";
import Error "mo:base/Error";

actor Calculator {
  var currentResult : Float = 0;

  public func calculate(x : Float, y : Float, op : Text) : async ?Float {
    switch (op) {
      case "+" { currentResult := x + y; };
      case "-" { currentResult := x - y; };
      case "*" { currentResult := x * y; };
      case "/" {
        if (y == 0) {
          return null; // Division by zero
        };
        currentResult := x / y;
      };
      case _ {
        return null; // Invalid operator
      };
    };
    ?currentResult
  };

  public func clear() : async () {
    currentResult := 0;
  };

  public query func getResult() : async Float {
    currentResult
  };
}
