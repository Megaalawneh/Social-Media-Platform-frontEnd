import Button from "@mui/material/Button";

export default function Footer() {

  return (
    
    <div style={{background:"rgb(35, 34, 34)",display:'flex', justifyContent:"center",alignItems:"center"}}>
      <Button>about</Button>
      <Button>Help</Button>
      <Button>contact us</Button>
      <select style={{borderRadius:"none" ,marginLeft:"5px"}}>
        <option>English</option>
        <option>Arabic</option>
      </select>
  
    </div>
  );
}
