
document.getElementById('searchInput').addEventListener('input', function() {
    var inputValue = this.value.trim();

    // Sprawdź, czy wprowadzony kod ma długość 13 (EAN-13)
    if (inputValue.length === 13) {
        searchData(); // Automatyczne uruchomienie wyszukiwania
    }
});
function searchData() {
    var searchInput = document.getElementById('searchInput').value;

    // Sprawdzenie, czy podano dane do wyszukania
    if (searchInput.trim() === "") {
        // Wyświetlanie komunikatu o braku danych
        document.getElementById('resultContainer').innerHTML = '<p class="no-results">Brak danych.</p>';
        return;
    }

    var import config from './config';
    var const apiKey = config.apiKey;
    
    var sheetId = '1wKKsJZCgUvjmu4BgWspVDH3IHcE5WJtCpiuBiamppnk';

    // Czyszczenie poprzednich wyników
    var resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    // Czyszczenie pola do wprowadzania danych
    document.getElementById('searchInput').value = '';

    // Tworzenie żądania do Google Sheets API
    var url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Arkusz1?key=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            var rows = data.values;

            // Szukanie pasujących danych w kolumnie "D,E"
            for (var i = 0; i < rows.length; i++) {
                if (rows[i][3].toLowerCase() === searchInput.toLowerCase() || rows[i][4].toLowerCase() === searchInput.toLowerCase()) {
                    // Tworzenie tabeli
                    var table = document.createElement('table');

                    // Określanie kolejności wyświetlanych kolumn
                    var columnOrder = [0, 1, 9, 2, 4, 3, 5];

                    // Dodawanie wierszy z danymi
                    for (var j = 0; j < columnOrder.length; j++) {
                        var row = table.insertRow(j);
                        var headerCell = row.insertCell(0);
                        var dataCell = row.insertCell(1);
                        headerCell.textContent = data.values[0][columnOrder[j]];
                        dataCell.textContent = rows[i][columnOrder[j]];

                        // Dodanie efektu podświetlenia przemiennie
                        if (j % 2 === 0) {
                            row.classList.add('highlight-even');
                        } else {
                            row.classList.add('highlight-odd');
                        }
                    }

                    // Dodawanie tabeli do wyniku
                    resultContainer.appendChild(table);
                }
            }

            // Obsługa braku wyników
            if (resultContainer.children.length === 0) {
                resultContainer.innerHTML = '<p class="no-results">Brak pasujących wyników.</p>';
            }
        })
        .catch(error => {
            // Obsługa błędu i wyświetlanie powiadomienia
            resultContainer.innerHTML = `<p class="error-message">Błąd: ${error.message}</p>`;
        });
}
