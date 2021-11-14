'use strict';

class ImageAnnotator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anno: null
    }
  }

  componentDidMount() {
      var anno = Annotorious.init({
          image: document.getElementById('img1'),
          widgets: [
            'COMMENT'
          ]
      });
      anno.loadAnnotations('img1_anno.json');
      this.setState({ anno: anno });
  }

  saveAnnotations() {
    fetch('/api/save_annotations', {
      method: 'POST',
      body: JSON.stringify({ content: JSON.stringify(this.state.anno.getAnnotations()) }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) return response.text()
    }).then(text => {
      console.log(text);
    }).catch(err => {
      console.log('Error:', err);
    })
  }

  render() {
    return (
        <div>
            <img id="img1" src="/ui/img1.jpg" width="300" />
            <button onClick={() => this.saveAnnotations()}>Save</button>
        </div>
    );
  }
}

export { ImageAnnotator }