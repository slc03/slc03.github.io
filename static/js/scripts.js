

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'awards', 'blog']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const container = document.getElementById(name + '-md');
                container.innerHTML = html;
                if (name === 'blog') {
                    renderBlogList(container);
                }
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

    function renderBlogList(container) {
        fetch(content_dir + 'posts/index.json')
            .then(resp => resp.json())
            .then(posts => {
                const row = document.createElement('div');
                row.className = 'row g-4 mt-1';
                posts.forEach(post => {
                    const col = document.createElement('div');
                    col.className = 'col-12';
                    const card = document.createElement('div');
                    card.className = 'card border-0 shadow-sm';
                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    const title = document.createElement('h5');
                    title.className = 'card-title';
                    const a = document.createElement('a');
                    a.href = 'post.html?slug=' + encodeURIComponent(post.slug);
                    a.textContent = post.title || post.slug;
                    title.appendChild(a);
                    const meta = document.createElement('div');
                    meta.className = 'text-muted small mb-2';
                    meta.textContent = post.date || '';
                    const excerpt = document.createElement('p');
                    excerpt.className = 'card-text';
                    excerpt.textContent = post.excerpt || '';
                    cardBody.appendChild(title);
                    cardBody.appendChild(meta);
                    cardBody.appendChild(excerpt);
                    card.appendChild(cardBody);
                    col.appendChild(card);
                    row.appendChild(col);
                });
                container.appendChild(row);
            })
            .catch(err => console.log(err));
    }

}); 
