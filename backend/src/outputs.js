import { stringToHex, bytesToHex } from "viem";
class Output {
  payload;
  type;
  constructor(_payload) {
    this.type = "output";
    if (_payload.slice(0, 2) === "0x") {
      this.payload = _payload;
    } else {
      this.payload = stringToHex(_payload);
    }
  }
}

class Voucher extends Output {
  destination;
  constructor(_destination, _payload) {
    let hexpayload = bytesToHex(_payload);
    super(hexpayload);
    this.type = "voucher";
    this.destination = _destination;
  }
}

class Notice extends Output {
  constructor(_payload) {
    super(_payload);
    this.type = "notice";
  }
}
class Report extends Output {
  constructor(_payload) {
    super(_payload);
    this.type = "report";
  }
}

class Log extends Output {
  constructor(_payload) {
    super(_payload);
    this.type = "log";
  }
}

class Error_out extends Output {
  constructor(_payload) {
    super(_payload);
    this.type = "error";
  }
}

export { Voucher, Notice, Log, Report, Error_out, Output };