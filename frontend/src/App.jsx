import { GraphQLProvider } from "./GraphQL";
import HomePage from "./pages/HomePage";

const App = () => {
    return (
        <div className="   h-screen">

            <GraphQLProvider></GraphQLProvider>

            <div>
                <HomePage />
            </div>
        </div>
    );
};

export default App;
