import DataTable from "react-data-table-component";

function Home() {
  const columnsone = [
    {
      name: "number",
      selector: (row) => row.image,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "TVL",
      selector: (row) => row.tvl,
      sortable: true,
    },
    {
      name: "POOL",
      selector: (row) => row.pool,
      sortable: true,
    },
    {
      name: "TOKEN A",
      selector: (row) => row.tokena,
      sortable: true,
    },
    {
      name: "TOKEN B",
      selector: (row) => row.tokenb,
      sortable: true,
    },
    {
      name: "BUTTON 1",
      selector: (row) => row.button1,
      sortable: true,
    },
    {
      name: "BUTTON 2",
      selector: (row) => row.button2,
      sortable: true,
    },
    {
      name: "BUTTON 3",
      selector: (row) => row.button3,
      sortable: true,
    },
  ];
  const dataone = [
    {
      id: 1,
      image: <div>s.no</div>,
      name: "DINU/CINU",
      tvl: <div>$7.01</div>,
      pool: <div>0x5d4…7a1ac</div>,
      tokena: <div>hhhhhhhhhhhhh</div>,
      tokenb: <div>1</div>,
      button1: <div>2</div>,
      button2: <div>3</div>,
      button3: <div>4</div>,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="liquidity-table-1">
              <DataTable
                columns={columnsone}
                data={dataone}
                theme="solarized"
                defaultSortAsc={true}
                pagination
                highlightOnHover
                dense
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
