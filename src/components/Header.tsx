export default function Header() {
	return (
		<div className="container">
			<header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
				<a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
					<span className="fs-4">Zip Codes By Radius</span>
				</a>
				<ul className="nav nav-pills">
					<li className="nav-item">
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="nav-link">Zip Codes List</a>
					</li>
					<li className="nav-item">
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="nav-link">Radius Reports</a>
					</li>
					<li className="nav-item">
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="nav-link">FAQs</a>
					</li>
				</ul>
			</header>
		</div>
	);
}
