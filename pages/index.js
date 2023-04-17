import Head from "next/head";
import { useState,useEffect} from "react";
import styles from "./index.module.css";
import cardMap from '../lib/constants.js';

export default function Home() {
  const [cardInput, setCardInput] = useState();
  const [result, setResult] = useState();
  

  async function onSubmit(event) {
    event.preventDefault();
    setCardInput(getRandomCard())
    
  }


  useEffect( () => {
    if (!cardInput){
      console.log(cardInput)
    }
      
    else{
    (async ()=>{
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ card: cardInput }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }
        console.log(cardMap[cardInput])
        setResult(data.result);
    
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    })()
  }
},[cardInput]);


 function getRandomCard(){
  let keys = Object.keys(cardMap);
  let key =keys[ keys.length * Math.random() << 0]
  return key

 }
    
   


  return (
    <div>
      <Head>
        <title>Tarot Reader</title>
        <link rel="icon" href="/crystal-ball.png" />
      </Head>
      
      <main  className={styles.main}>
        <img src="/crystal-ball.png" className={styles.icon} />
        <h3>Tarot Reader</h3>
        <form onSubmit={onSubmit}>
          
          <input type="submit"  value="Draw a Random Card" />
        </form>
        <img className={styles.card} src={ typeof(cardInput) === 'undefined'? "./cardback.jpg": cardMap[cardInput]} alt="" />
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
