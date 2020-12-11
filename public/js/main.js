var assistant_shown = false;
var main_text_content;
var media_list_content;

function set_listeners() {
    document.getElementById('assistant-container').onmouseover = function() {
        if (!assistant_shown) {
            document.getElementById('assistant-img').src = "public/img/assistant-gif.gif";
            assistant_shown = true;
            
            setTimeout(function() {
                let contact_info_container = document.getElementById('contact-info-container');
                contact_info_container.className = 'fade-in';
                contact_info_container.style.visibility = 'visible';
            }, 800);
        }
    }
}

function populate_cms_content() {
    
    fetch('https://gia-kuan-consulting.cdn.prismic.io/api/v2')
    .then(response => response.json())
    .then(function(data) {

        let master_ref = data.refs[0].ref;

        fetch('https://gia-kuan-consulting.cdn.prismic.io/api/v2/documents/search?ref=' + master_ref)
        .then(response => response.json())
        .then(function(data) {

            let media_list_content = data.results[0].data.media_list;
            let main_text_content = data.results[1].data.main_text;

            //Populate main text
            let main_text_div = document.getElementById('main-text');
            for (let p of main_text_content) {
                let p_elem = document.createElement('p');
                p_elem.textContent = p.text;
                main_text_div.appendChild(p_elem);
            }

            //Populate media list
            let media_list_div = document.getElementById('media-list');
            for (let media_item of media_list_content) {
                if (Object.keys(media_item.image) != 0) {
                    let img_elem = document.createElement('img');
                    img_elem.className = 'media-item';
                    img_elem.src = media_item.image.url;
                    media_list_div.appendChild(img_elem);
                }
                else if (Object.keys(media_item.video) != 0) {
                    let iframe_elem = document.createElement('iframe');
                    iframe_elem.className = 'media-item';
                    
                    let embed_url = media_item.video.embed_url;
                    if (embed_url.includes('youtube.com')) {
                        let video_id = embed_url.substring(embed_url.indexOf('v=') + 2);
                        embed_url = 'https://www.youtube.com/embed/' + video_id;
                    }
                    
                    iframe_elem.src = embed_url;
                    iframe_elem.style.width = '100%';
                    iframe_elem.onload = () => iframe_elem.style.height = (iframe_elem.clientWidth * 9/16) + 'px';
                    media_list_div.appendChild(iframe_elem);
                }
            }

        });

    });
    
}





window.onload = function() {
    populate_cms_content();
    set_listeners();
}
