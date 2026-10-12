

function PageTitle({eyebrow,title,description,action}){return <div className="page-titlebar"><div><div className="admin-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
export default PageTitle;
