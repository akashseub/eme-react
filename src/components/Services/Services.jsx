import { Link } from "react-router-dom";
import ProjectStatus from "../ProjectStatus/ProjectStatus";

const Services = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="title_bar">
        <div className="navbar bg-base-400">
          <div className="flex-1">
            <Link to={"/"}>
              <a className="btn btn-ghost text-xl">EMEISLTD</a>
            </Link>
          </div>
          <div className="flex-none gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
              />
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS Navbar component" src="" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProjectStatus></ProjectStatus>
      </div>
    </div>
  );
};

export default Services;
