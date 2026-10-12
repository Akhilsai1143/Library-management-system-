 import { useEffect, useState } from "react";

import BorrowForm from "../components/BorrowForm";
import LoanList from "../components/LoanList";

function Loans() {

    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);

    const fetchData = async () => {

        try {

            const [
                loansResponse,
                booksResponse,
                membersResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:5000/api/loans"
                ),

                fetch(
                    "http://localhost:5000/api/books"
                ),

                fetch(
                    "http://localhost:5000/api/members"
                )

            ]);

            const loansData =
                await loansResponse.json();

            const booksData =
                await booksResponse.json();

            const membersData =
                await membersResponse.json();

            setLoans(loansData);
            setBooks(booksData);
            setMembers(membersData);

        } catch (error) {

            console.error(
                "Error fetching loan data:",
                error
            );

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="page">

            <div className="page-title">

                <div>
                    <h1>
                        Loans
                    </h1>

                    <p>
                        Borrow books, process returns and track loan history.
                    </p>
                </div>

                <div className="header-date">
                    🔄 {loans.length} Transactions
                </div>

            </div>

            <BorrowForm
                books={books}
                members={members}
                onBorrow={fetchData}
            />

            <LoanList
                loans={loans}
                onReturn={fetchData}
            />

        </div>
    );
}

export default Loans;