// import React from 'react';
// import { PurchaseHistory } from "../constants"; // Assuming PurchaseHistory data is exported from constants

// type Props = {}

// const PurchaseHistory = (props: Props) => {
//  return (
//     <div>
//       <div className="flex flex-col w-full max-md:ml-0 max-md:w-full ">
//         <div className="flex flex-col grow justify-center pb-3 md:pb-36 w-full text-base bg-zinc-800 max-md:mt-8 max-md:max-w-full">
//           <div className="justify-center px-8 py-6 text-md md:text-xl font-bold text-white bg-neutral-900 max-md:px-5 max-md:max-w-full">
//             Purchase History
//           </div>
//           {PurchaseHistory.slice(-5).map((purchase, index) => (
//             <div key={index} className="flex flex-col justify-center px-8 py-10 border-b border-solid bg-zinc-800 border-zinc-800 max-md:max-w-full">
//               <div>ID: {purchase.id}</div>
//               <div>Address: {purchase.address}</div>
//               <div>Ticket Type: {purchase.ticketType}</div>
//               <div>Time: {purchase.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//  );
// }

// export default PurchaseHistory;
