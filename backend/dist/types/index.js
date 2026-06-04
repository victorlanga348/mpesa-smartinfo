"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingStatus = exports.AgentStatus = void 0;
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ONLINE"] = "ONLINE";
    AgentStatus["OFFLINE"] = "OFFLINE";
    AgentStatus["ON_MY_WAY"] = "ON_MY_WAY";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var PingStatus;
(function (PingStatus) {
    PingStatus["PENDING"] = "PENDING";
    PingStatus["ACCEPTED"] = "ACCEPTED";
    PingStatus["ON_MY_WAY"] = "ON_MY_WAY";
    PingStatus["EXPIRED"] = "EXPIRED";
    PingStatus["COMPLETED"] = "COMPLETED";
})(PingStatus || (exports.PingStatus = PingStatus = {}));
