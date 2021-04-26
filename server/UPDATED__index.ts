import express from 'express';
import uuid from 'uuid';
import fs from 'fs';
import mongoose from "mongoose"
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath, db_connection } from '@fed-exam/config';
import {Ticket} from '../client/src/api';
import * as TicketModel  from './models/TicketModel';


export enum SortType {
  ByDate = "Sort by date",
  ByTitle = "Sort by title",
  ByEmail = "Sort by email",
}

console.log('starting server', { serverAPIPort, APIPath });

const app = express();
const router = express.Router();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  
  // @ts-ignore
  let page: number = req.query.page || 1;
  // @ts-ignore
  const sortBy : string = req.query.sortBy || "";
  // @ts-ignore
  const superSearch: string = req.query.superSearch || "";

  
  /** SuperSearch
   * not used
   * A worthy solution that takes the exponential growth of the number of tickets
   * need a fast DB like mongodb, which can index words in fields like title and content,
   * it can quickly return the tickets matched to the given word,
   * but it needs few changes in the current architecture.
   * create a server-side card model, and connect the server-side to mongodb
   * import the current data.json to DB
   * prepare a query that returns the information according to the required pages (20)
   * prepare a query that receives a search word and returns only the tickets
   * within the title fields and their contents the word was found
   */
  if(superSearch !== "") {
    console.log("superSearch : ");
    let arrSuperSearch :Ticket[] = [];
    tempData.map((ticket)=>{
      return (ticket.content.match("/" + superSearch + "/gm") || ticket.title.match("/" + superSearch + "/gm"))
    });
  }

  //SortBy
  if(sortBy !== ""){
    const slicedData = tempData.slice(0, page * PAGE_SIZE);
    slicedData.sort((a: Ticket, b: Ticket) => {
      switch (req.query.sortBy) {
        case SortType.ByDate:
          return a.creationTime - b.creationTime;
        case SortType.ByTitle:
          if (a.title < b.title) return -1;
          else if (a.title > b.title) return 1;
          return 0;
        case SortType.ByEmail:
          if (a.userEmail < b.userEmail) return -1;
          else if (a.userEmail > b.userEmail) return 1;
          return 0;
        default:
          return 0;
      }
    });
    req.query.sortBy !== "" && req.query.desc === 'true' && slicedData && slicedData.reverse();
    res.send(slicedData);
  }else {
    const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    res.send(paginatedData);
  }

});

app.post(APIPath, (req, res)=>{
  if(req.body){
    console.log('posted new ticket');
    const newTicket: Ticket = req.body as Ticket;
    newTicket.id = uuid.v4();

    fs.readFile('./data.json',  (err, data: any)=> {
      let json = JSON.parse(data);
      json.push(newTicket);
  
      fs.writeFile("./data.json", JSON.stringify(json), (err) =>{
        err ? console.log("file was not reahcable!") : console.log("file upated succesfully!");
      });
    });
    res.send(true);
  }else {
    res.send(false);
  }
});

//Connect to DB
mongoose.connect(db_connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true }, ()=>{
  console.log("connected to DB!");
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)


