package com.example.post.repository;

import com.example.post.entity.PostStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostStatsRepository extends JpaRepository<PostStats, Integer> {
}
