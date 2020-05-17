function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var id = getUrlParameter('id');
var uidline = getUrlParameter('useridline');

const uploadForm = document.getElementById("uploadForm");
const inputFIle = document.getElementById("inputFile");


uploadForm.addEventListener("submit", uploadFile);

function uploadFile(e) {
    $('#progress-layout').html(`   
        <div class="progress" style="margin-top: 20px; " id="progress">
            <div class="progress-bar" role="progressbar" " aria-valuemin="0" aria-valuemax="100">0%</div>
        </div>
    `)

    const progress_bar = document.getElementsByClassName("progress-bar")[0];
    
    e.preventDefault();
    
    var data = new FormData(uploadForm)
    console.log(e.target[0].files[0].name);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://content.dropboxapi.com/2/files/upload");
    xhr.upload.addEventListener("progress" , e => {
        
        const percent = e.lengthComputable ? (e.loaded/e.total) * 100 : 0;

        progress_bar.style.width = percent.toFixed(2) + "%";
        progress_bar.textContent = percent.toFixed(2) + "%";
        
    })

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.responseText)
            let res = JSON.parse(xhr.responseText)

            const xhr2 = new XMLHttpRequest();
            xhr2.open("POST", "https://api.dropboxapi.com/2/sharing/create_shared_link");
            xhr2.setRequestHeader("Content-Type", "application/json");
            xhr2.setRequestHeader("Authorization", "Bearer ROeWeTjqfBAAAAAAAAAAOYwHy2klMADhjU6sTCA_4NxLtOw46GAr0VGGNVcYa8kr");
            

            xhr2.onreadystatechange = function() {
                if (xhr2.readyState == XMLHttpRequest.DONE) {
                    console.log(xhr2.responseText)
                    let res = JSON.parse(xhr2.responseText)

                    window.location = '/pesanan.html?id=' + id +"&useridline="+ uidline  +'&linkfile='+ res["url"];
                }
            }
           
            data = "{\"path\": \""+res["path_display"]+"\",\"short_url\": false}" 
            console.log(data)
            xhr2.send(data)
            
        }
    }
    
    xhr.setRequestHeader("Authorization", "Bearer ROeWeTjqfBAAAAAAAAAAOYwHy2klMADhjU6sTCA_4NxLtOw46GAr0VGGNVcYa8kr");
    xhr.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/getprint/"+e.target[0].files[0].name+"\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}");
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(data);
    
}
