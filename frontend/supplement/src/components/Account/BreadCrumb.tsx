import React, { useState } from 'react'
import { Breadcrumbs} from "@mui/material"
import { Link } from 'react-router-dom'

export const BreadCrumb: React.FC<{path: string[]}> = (props) => {

    const [breadNames] = useState<string[]>(props.path);
    
    const handlePath = (item: string) => {
      if(item == "account") return "dashboard";
      if(item == "order") return "current-orders";
      return item;
    }

    const handleName = (item: string) => {
      item = item.replace("-", " ");
      if(item == "current-order") return "Current Orders";
      if(item == "past-order") return "Past Orders";
      return item.charAt(0).toUpperCase() + item.slice(1);
    }

  return (
    <div className="bread-crumb-area">
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Link to="/home" className="bread-name">
        Home
      </Link>
      {breadNames.map((item: string) => (
        <Link to={`/${handlePath(item)}`} className="bread-name" key={item}>
          {handleName(item)}
        </Link>
      ))}
    </Breadcrumbs>
  </div>
  )
}
