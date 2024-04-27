import { GraphQLProvider } from "./GraphQL";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TopNav from "./layout/TopNav";

const App = () => {
    return (
        <div className="   h-screen">
            {/* <TopNav /> */}

            <GraphQLProvider></GraphQLProvider>

            <div>
                {/* <MainNav /> */}

                <HomePage />
            </div>
        </div>
    );
};

export default App;
