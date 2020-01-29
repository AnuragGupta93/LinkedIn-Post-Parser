import React from 'react';
import profileData from './profileData';
import './Card.css';

const data = profileData.map(el => {
  let fullName = el.fullName;
  let title = el.title;
  let skills = el.skills.join(',');
  return {
    fullName,
    title,
    skills
  };
});
class App extends React.Component {
  state = {
    filter: '',
    data: data
  };

  handleChange = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { filter, data } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toLowerCase().includes(lowercasedFilter)
      );
    });

    return (
      <div>
        <div className="search-box">
          <input placeholder="Search Skills" value={filter} onChange={this.handleChange} />
          <i id="icon" className="search id"></i>
        </div>
        {filteredData.map(item => (
          <div className="container">
            <div className="cards">
              <div className="card-item">
                <div className="card-info">
                  <h2 className="card-title">{item.fullName}</h2>
                  <p className="card-intro">{item.title}</p>
                  <b>Skills:</b>
                  <br/>
                  {item.skills.split(',').map(el => {
                    return <span id="article__category">{el}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
