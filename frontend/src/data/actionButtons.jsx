export const userActions = (navigate) => [
    { 
        label: "Página principal",
        href: "/dashboard",     
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M4 11L12 5L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 10V19H18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>),   
        onClick: () => navigate("/dashboard") 
    },
    { 
        label: "Ver todos",
        href: "/incident-list",     
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="20" y2="12"/>
                <line x1="8" y1="18" x2="20" y2="18"/>
                <circle cx="4" cy="6" r="1"/>
                <circle cx="4" cy="12" r="1"/>
                <circle cx="4" cy="18" r="1"/>
            </svg>),   
        onClick: () => navigate("/incident-list") 
    },
    { 
        label: "Nuevo incidente",
        href: "/create-incident",         
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>),
        onClick: () => navigate("/create-incident") 
    },
    { 
        label: "Suscritos",
        href: "/subscribed",
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6L12 2z"/>
            </svg>),       
        onClick: () => navigate("/subscribed") 
    },
    { 
        label: "Mis incidentes",
        href: "/my-incidents",      
        svg: 
            (<svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none">
                <path d="M6 2h9l5 5v15H6z" strokeWidth="2"/>
                <line x1="9" y1="13" x2="15" y2="13" strokeWidth="2"/>
                <line x1="9" y1="17" x2="15" y2="17" strokeWidth="2"/>
            </svg>),
        onClick: () => navigate("/my-incidents") 
    }
];

export const adminActions = (navigate) => [
    { 
        label: "Ver usuarios",
        href: "/user-list",     
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15 7q-.425 0-.712-.288T14 6t.288-.712T15 5h6q.425 0 .713.288T22 6t-.288.713T21 7zm0 4q-.425 0-.712-.288T14 10t.288-.712T15 9h6q.425 0 .713.288T22 10t-.288.713T21 11zm0 4q-.425 0-.712-.288T14 14t.288-.712T15 13h6q.425 0 .713.288T22 14t-.288.713T21 15zm-9.125-1.875Q5 12.25 5 11t.875-2.125T8 8t2.125.875T11 11t-.875 2.125T8 14t-2.125-.875M2 19v-.9q0-.525.25-1t.7-.75q1.125-.675 2.388-1.012T8 15t2.663.338t2.387 1.012q.45.275.7.75t.25 1v.9q0 .425-.288.713T13 20H3q-.425 0-.712-.288T2 19m2.15-1h7.7q-.875-.5-1.85-.75T8 17t-2 .25t-1.85.75m4.563-6.288Q9 11.425 9 11t-.288-.712T8 10t-.712.288T7 11t.288.713T8 12t.713-.288M8 18"/>
            </svg>),   
        onClick: () => navigate("/user-list") 
    },
    { 
        label: "Ver categorías",
        href: "/category-list",
        svg: 
            (<svg fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>),       
        onClick: () => navigate("/category-list") 
    }
];

export const workerActions = (navigate) => [
    { 
        label: "Asignados",     
        href: "/assigned-list",
        svg: 
            (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19h6v-1H6zm.75-9h4.5q.3 0 .525-.225T12 9.25t-.225-.525t-.525-.225h-4.5q-.3 0-.525.225T6 9.25t.225.525t.525.225m0-2.5h4.5q.3 0 .525-.225T12 6.75t-.225-.525T11.25 6h-4.5q-.3 0-.525.225T6 6.75t.225.525t.525.225M16 11V9h2V7h-2V5h2q.825 0 1.413.588T20 7h2q.425 0 .713.288T23 8t-.288.713T22 9h-2q0 .825-.587 1.413T18 11zm-4 5h-2v-5h4V5H6q-.825 0-1.412.588T4 7v2q0 .825.588 1.413T6 11h2v5H6v-3q-1.65 0-2.825-1.175T2 9V7q0-1.65 1.175-2.825T6 3h8q.825 0 1.413.588T16 5v6q0 .825-.587 1.413T14 13h-2zm-6.5 5q-.625 0-1.062-.437T4 19.5v-2q0-.625.438-1.062T5.5 16h7q.625 0 1.063.438T14 17.5v2q0 .625-.437 1.063T12.5 21zm6.5-2H6z"/>
            </svg>),   
        onClick: () => navigate("/assigned-list") 
    }
];

export const getActionsByRole = (role, navigate) => {
  switch (role) {
    case "admin":
      return [...userActions(navigate), ...adminActions(navigate)];
    case "worker":
      return [...userActions(navigate), ...workerActions(navigate)];
    case "user":
    default:
      return userActions(navigate);
  }
};