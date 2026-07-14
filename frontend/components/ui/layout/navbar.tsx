import {jockeyOneRegular} from "@/app/layout";

function Navbar() {
    return (
    <header className="bg-white border-black border-b-2 rounded-xl">
        <div className={`max-w mx-auto px-8 py-2 flex items-center h-14 gap-6 ${jockeyOneRegular.className}`}>
            <div className="text-xl">Dashboard</div>
            <div className="text-xl">Background</div>
            <div className="text-xl">Research</div>
            <div className="text-xl">Dataset</div>
            <div className="text-xl">Methodology</div>
            <div className="text-xl">Result</div>
            <div className="text-xl">Try Model</div>
        </div>
    </header>
    );
}
export default Navbar;
