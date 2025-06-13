import { useState, useEffect, useContext } from "react";
import { UserContext } from "../function/UserContext";

export default function SavedVocabList() {
    const { username } = useContext(UserContext);
    const [vocabList, setVocabList] = useState([]);

    const fetchVocabulary = async () => {
        try {
            const res = await fetch(`http://localhost:3000/get-vocab?username=${username}`);
            const data = await res.json();
            setVocabList(data);
        } catch (err) {
            console.error("Failed to fetch vocabulary:", err);
        }
    };

    const handleDelete = async (wordToDelete) => {
        try {
            const res = await fetch("http://localhost:3000/delete-vocab", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, word: wordToDelete }),
            });
            const result = await res.json();
            if (result.success) {
                setVocabList((prev) => prev.filter((v) => v.word !== wordToDelete));
            } else {
                alert("❌ Không thể xóa từ.");
            }
        } catch (err) {
            console.error("Lỗi khi xoá từ vựng:", err);
            alert("❌ Lỗi khi xoá.");
        }
    };

    useEffect(() => {
        if (!username) return;

        fetchVocabulary();

        const handleVocabSaved = () => {
            fetchVocabulary();
        };

        window.addEventListener("vocabSaved", handleVocabSaved);
        return () => window.removeEventListener("vocabSaved", handleVocabSaved);
    }, [username]);

    return (
        <div className="saved-vocab-list">
            <h3>📚 Saved Vocabulary</h3>
            {vocabList.length === 0 ? (
                <p>Empty.</p>
            ) : (
                <ul>
                    {vocabList.map((v, idx) => (
                        <li key={idx} className="saved-vocab-item">
                            <div>
                                <strong>{v.word}</strong><br />
                                {v.ipa && <em>{v.ipa}</em>}<br />
                                {v.meaning}
                            </div>
                            <button onClick={() => handleDelete(v.word)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
